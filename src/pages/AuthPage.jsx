
    import React from 'react';
    import AuthForm from '@/components/AuthForm';
    import { motion } from 'framer-motion';

    const AuthPage = ({ onSignIn, onSignUp, onPasswordReset, onAnonymousSignIn, isLoading }) => {
      return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="flex items-center justify-center py-12"
        >
            <AuthForm
              onSignIn={onSignIn}
              onSignUp={onSignUp}
              onPasswordReset={onPasswordReset}
              onAnonymousSignIn={onAnonymousSignIn}
              isLoading={isLoading}
            />
        </motion.div>
      );
    };
    export default AuthPage;
  