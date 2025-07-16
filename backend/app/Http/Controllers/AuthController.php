<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Auth\Events\Verified;
use App\Models\User;

/**
 * @group Authentication
 * 
 * User authentication and profile management.
 */
class AuthController extends Controller
{
    /**
     * Register User
     * 
     * Register a new user account.
     * 
     * @bodyParam name string required The user's full name. Example: John Doe
     * @bodyParam email string required The user's email address. Example: john@example.com
     * @bodyParam password string required The user's password (minimum 6 characters). Example: password123
     * @bodyParam password_confirmation string required Password confirmation. Example: password123
     * 
     * @response 201 {
     *   "message": "Registration successful",
     *   "user": {
     *     "id": 1,
     *     "name": "John Doe",
     *     "email": "john@example.com",
     *     "created_at": "2025-07-13T18:22:56.000000Z",
     *     "updated_at": "2025-07-13T18:22:56.000000Z"
     *   },
     *   "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9..."
     * }
     * 
     * @response 422 {
     *   "errors": {
     *     "email": ["The email has already been taken."],
     *     "password": ["The password confirmation does not match."]
     *   }
     * }
     */
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        // Send verification email
        $user->sendEmailVerificationNotification();

        $token = $user->createToken('authToken')->accessToken;

        return response()->json([
            'message' => 'Registration successful. Please check your email to verify your account.',
            'user' => $user,
            'token' => $token,
            'email_verification_sent' => true,
        ], 201);
    }

    /**
     * Login User
     * 
     * Authenticate user and return access token.
     * 
     * @bodyParam email string required The user's email address. Example: john@example.com
     * @bodyParam password string required The user's password. Example: password123
     * 
     * @response 200 {
     *   "message": "Login successful",
     *   "user": {
     *     "id": 1,
     *     "name": "John Doe",
     *     "email": "john@example.com",
     *     "created_at": "2025-07-13T18:22:56.000000Z",
     *     "updated_at": "2025-07-13T18:22:56.000000Z"
     *   },
     *   "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9..."
     * }
     * 
     * @response 401 {
     *   "message": "Invalid credentials"
     * }
     */
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = User::where('email', $request->email)->first();
        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        $token = $user->createToken('authToken')->accessToken;

        $response = [
            'message' => 'Login successful',
            'user' => $user,
            'token' => $token,
        ];

        // Add verification status to response
        if (!$user->hasVerifiedEmail()) {
            $response['email_verification_required'] = true;
            $response['message'] = 'Login successful. Please verify your email address to access all features.';
        }

        return response()->json($response);
    }

    /**
     * Resend Verification Email
     * 
     * Resend the email verification notification.
     * 
     * @authenticated
     * 
     * @response 200 {
     *   "message": "Verification link sent!"
     * }
     */
    public function resendVerificationEmail(Request $request)
    {
        if ($request->user()->hasVerifiedEmail()) {
            return response()->json([
                'message' => 'Email already verified'
            ], 400);
        }

        $request->user()->sendEmailVerificationNotification();

        return response()->json([
            'message' => 'Verification link sent!'
        ]);
    }

    /**
     * Verify Email
     * 
     * Mark the authenticated user's email address as verified.
     * 
     * @authenticated
     * 
     * @response 200 {
     *   "message": "Email has been verified"
     * }
     */
    public function verifyEmail(Request $request)
    {
        $user = $request->user();

        if ($user->hasVerifiedEmail()) {
            return response()->json([
                'message' => 'Email already verified'
            ], 400);
        }

        if ($user->markEmailAsVerified()) {
            event(new Verified($user));
        }

        return response()->json([
            'message' => 'Email has been verified',
            'user' => $user->fresh()
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->token()->revoke();
        return response()->json(['message' => 'Successfully logged out']);
    }

    public function profile(Request $request)
    {
        return response()->json(['user' => $request->user()]);
    }

    public function updateProfile(Request $request)
    {
        $user = $request->user();
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
        ]);
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        $user->update($request->only(['name', 'email']));
        return response()->json([
            'message' => 'Profile updated successfully',
            'user' => $user,
        ]);
    }
} 