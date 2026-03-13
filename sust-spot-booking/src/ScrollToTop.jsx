import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]); // যখনই পাথ চেঞ্জ হবে তখনই স্ক্রল উপরে যাবে

  return null;
}