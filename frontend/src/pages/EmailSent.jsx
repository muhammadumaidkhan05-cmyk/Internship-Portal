import { motion } from "framer-motion";
import { Mail, Check, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

function EmailSent() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-100 px-4 py-10">

      {/* Ambient Background Glow */}
      <div className="absolute -left-32 -top-32 h-80 w-80 rounded-full bg-blue-300/30 blur-3xl" />

      <div className="absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-blue-200/30 blur-3xl" />

      <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-200/20 blur-3xl" />

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.7,
          ease: "easeOut",
        }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="rounded-3xl border border-white/70 bg-white/85 p-8 text-center shadow-2xl backdrop-blur-xl sm:p-10">

          {/* Email Illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              delay: 0.2,
              duration: 0.5,
              ease: "easeOut",
            }}
            className="relative mx-auto mb-8 flex h-32 w-32 items-center justify-center"
          >
            {/* Soft Circle Background */}
            <motion.div
              animate={{
                scale: [1, 1.06, 1],
                opacity: [0.25, 0.4, 0.25],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute inset-0 rounded-full bg-blue-100"
            />

            {/* Envelope */}
            <motion.div
              initial={{ y: 8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                delay: 0.3,
                duration: 0.5,
              }}
              className="relative z-10 flex h-20 w-24 items-center justify-center rounded-xl border-2 border-blue-500 bg-blue-100 shadow-lg shadow-blue-500/20"
            >
              <Mail
                size={58}
                strokeWidth={1.7}
                className="text-blue-600"
              />
            </motion.div>

            {/* Success Check */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                delay: 0.55,
                duration: 0.45,
                type: "spring",
                stiffness: 220,
                damping: 12,
              }}
              className="absolute -right-1 -top-1 z-20 flex h-11 w-11 items-center justify-center rounded-full border-4 border-white bg-blue-600 text-white shadow-lg shadow-blue-600/30"
            >
              <Check size={22} strokeWidth={3} />
            </motion.div>
          </motion.div>

          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.45,
              duration: 0.4,
            }}
          >
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Email Sent!!
            </h1>

            <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-500">
              We've sent a password reset link to your registered email
              address.
            </p>
          </motion.div>

          {/* Back to Login */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.6,
              duration: 0.4,
            }}
            className="mt-8"
          >
            <Link
              to="/login"
              className="group inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-900 bg-white py-3.5 text-sm font-semibold text-slate-900 shadow-sm transition-all duration-300 hover:bg-slate-900 hover:text-white hover:shadow-lg hover:shadow-slate-900/20 active:scale-95"
            >
              <ArrowLeft
                size={18}
                className="transition-transform duration-300 group-hover:-translate-x-1"
              />

              <span>Back to Login</span>
            </Link>
          </motion.div>

        </div>
      </motion.div>
    </div>
  );
}

export default EmailSent;