"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "@/app/auth.module.css";

export default function AuthForm({ mode }) {
  const isSignUp = mode === "sign-up";
  const [method, setMethod] = useState("mobile");
  const [step, setStep] = useState("contact");
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);

  function handleContinue(e) {
    e.preventDefault();
    if (step === "contact") setStep("otp");
  }

  function handleOtpChange(index, value) {
    if (!/^\d?$/.test(value)) return;
    const next = [...otp];
    next[index] = value;
    setOtp(next);
    if (value && index < otp.length - 1) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.card}>
        <div className={styles.mark}>HP</div>
        <div className={styles.title}>{isSignUp ? "Create your account" : "Welcome back"}</div>
        <div className={styles.subtitle}>
          {isSignUp
            ? "Sign up to save properties and get personalised alerts."
            : "Sign in to continue exploring homes in Dubai."}
        </div>

        {step === "contact" ? (
          <form onSubmit={handleContinue}>
            <div className={styles.methodToggle}>
              <button
                type="button"
                className={`${styles.methodBtn} ${method === "mobile" ? styles.methodBtnActive : ""}`}
                onClick={() => setMethod("mobile")}
              >
                Mobile Number
              </button>
              <button
                type="button"
                className={`${styles.methodBtn} ${method === "email" ? styles.methodBtnActive : ""}`}
                onClick={() => setMethod("email")}
              >
                Email
              </button>
            </div>

            {isSignUp && (
              <div className={styles.field}>
                <label className={styles.label} htmlFor="name">
                  Full Name
                </label>
                <div className={styles.inputRow}>
                  <input
                    id="name"
                    className={styles.input}
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </div>
            )}

            <div className={styles.field}>
              <label className={styles.label} htmlFor="contact">
                {method === "mobile" ? "Mobile Number" : "Email Address"}
              </label>
              <div className={styles.inputRow}>
                {method === "mobile" && <span className={styles.prefix}>+971</span>}
                <input
                  id="contact"
                  className={styles.input}
                  type={method === "mobile" ? "tel" : "email"}
                  placeholder={method === "mobile" ? "50 123 4567" : "you@example.com"}
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" className="hp-btn hp-btn-primary" style={{ width: "100%", padding: 14 }}>
              Continue
            </button>
          </form>
        ) : (
          <form onSubmit={(e) => e.preventDefault()}>
            <div className={styles.field}>
              <label className={styles.label}>Enter the 4-digit code sent to {contact || "your number"}</label>
              <div className={styles.otpRow}>
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    id={`otp-${i}`}
                    className={styles.otpDigit}
                    value={digit}
                    maxLength={1}
                    inputMode="numeric"
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                  />
                ))}
              </div>
            </div>
            <button type="submit" className="hp-btn hp-btn-primary" style={{ width: "100%", padding: 14 }}>
              Verify &amp; Continue
            </button>
            <div className={styles.resend}>
              Didn&apos;t get a code?{" "}
              <button type="button" className={styles.resendLink} onClick={() => setStep("contact")}>
                Resend / Change details
              </button>
            </div>
          </form>
        )}

        <div className={styles.switchRow}>
          {isSignUp ? (
            <>
              Already have an account?{" "}
              <Link href="/sign-in" className={styles.switchLink}>
                Sign in
              </Link>
            </>
          ) : (
            <>
              New to Hi Pando?{" "}
              <Link href="/sign-up" className={styles.switchLink}>
                Create an account
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
