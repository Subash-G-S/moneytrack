import { useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PiggyBank } from "lucide-react";

export default function Login() {
  const [mode, setMode] = useState<"login" | "register" | "forgot">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 🔹 Check password strength dynamically
  const checkPasswordStrength = (value: string) => {
    setPassword(value);

    if (value.length < 6) {
      setPasswordStrength("Weak");
    } else if (/[A-Z]/.test(value) && /\d/.test(value) && /[!@#$%^&*]/.test(value)) {
      setPasswordStrength("Strong");
    } else {
      setPasswordStrength("Medium");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      // 🔹 LOGIN
      if (mode === "login") {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // 🔒 Check email verification
        if (!user.emailVerified) {
          setError("Please verify your email before signing in.");
          await auth.signOut();
          setLoading(false);
          return;
        }

        navigate("/");

      // 🔹 REGISTER
      } else if (mode === "register") {
        if (password !== confirmPassword) {
          setError("Passwords do not match.");
          setLoading(false);
          return;
        }

        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // ✉️ Send verification email
        await sendEmailVerification(user);
        setMessage("Account created! A verification link has been sent to your email. Please verify before signing in.");
        setMode("login");

      // 🔹 FORGOT PASSWORD
      } else if (mode === "forgot") {
        await sendPasswordResetEmail(auth, email);
        setMessage("Password reset email sent. Check your inbox!");
        setMode("login");
      }
    } catch (err: any) {
      console.error(err);
      if (err.code === "auth/email-already-in-use") {
        setError("This email is already registered.");
      } else if (err.code === "auth/invalid-email") {
        setError("Invalid email address.");
      } else if (err.code === "auth/user-not-found") {
        setError("User not found.");
      } else if (err.code === "auth/wrong-password") {
        setError("Incorrect password.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Password strength color
  const getStrengthColor = () => {
    if (passwordStrength === "Weak") return "text-red-500";
    if (passwordStrength === "Medium") return "text-yellow-500";
    if (passwordStrength === "Strong") return "text-green-500";
    return "text-muted-foreground";
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <Card className="w-full max-w-md shadow-lg border border-border bg-card">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-3">
            <div className="p-3 rounded-full text-primary-foreground">
              <img src="/moneylogo180x180.png" className="h-8 w-8"></img>
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-foreground">
            FinTrack
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            {mode === "login" && "Sign in to continue"}
            {mode === "register" && "Create your account"}
            {mode === "forgot" && "Reset your password"}
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <Input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            {/* Password */}
            {mode !== "forgot" && (
              <>
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => checkPasswordStrength(e.target.value)}
                  required
                />

                {/* Password Strength */}
                {mode === "register" && password && (
                  <p className={`text-xs font-medium ${getStrengthColor()}`}>
                    Strength: {passwordStrength}
                  </p>
                )}
              </>
            )}

            {/* Confirm Password */}
            {mode === "register" && (
              <Input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            )}

            {/* Messages */}
            {error && <p className="text-sm text-red-500 text-center">{error}</p>}
            {message && (
              <p className="text-sm text-green-600 text-center">{message}</p>
            )}

            {/* Submit Button */}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading
                ? "Please wait..."
                : mode === "login"
                ? "Sign In"
                : mode === "register"
                ? "Create Account"
                : "Send Reset Email"}
            </Button>
          </form>

          {/* Toggle Options */}
          <div className="text-center mt-4 text-sm text-muted-foreground">
            {mode === "login" && (
              <>
                <p>
                  Don’t have an account?{" "}
                  <button
                    className="text-primary underline"
                    onClick={() => setMode("register")}
                  >
                    Sign Up
                  </button>
                </p>
                <p className="mt-2">
                  Forgot password?{" "}
                  <button
                    className="text-primary underline"
                    onClick={() => setMode("forgot")}
                  >
                    Reset here
                  </button>
                </p>
              </>
            )}

            {mode === "register" && (
              <p>
                Already have an account?{" "}
                <button
                  className="text-primary underline"
                  onClick={() => setMode("login")}
                >
                  Login
                </button>
              </p>
            )}

            {mode === "forgot" && (
              <p>
                Remember your password?{" "}
                <button
                  className="text-primary underline"
                  onClick={() => setMode("login")}
                >
                  Back to Login
                </button>
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
