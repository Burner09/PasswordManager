import React from "react";
import 'react-native-gesture-handler';

import AppNav from "./navigation/AppNav";
import { AuthProvider } from "./context/AuthContext";

export default function App() {
  return (
    <AuthProvider >
      <AppNav />
    </AuthProvider>
  );
}