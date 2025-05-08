import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUserStore } from "@/store/useUserStore";
import { Loader2 } from "lucide-react";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const VerifyEmail = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRef = useRef([]);
  const { loading, verifyEmail } = useUserStore();
  const navigate = useNavigate();

  const handleChange = (index, value) => {
    if (/^[a-zA-Z0-9]?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value && index < 5) inputRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRef.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();  
    const paste = e.clipboardData.getData("text").slice(0, 6);
    if (!/^[A-Za-z0-9]{6}$/.test(paste)) return;
    const newOtp = paste.split("");
    setOtp(newOtp);
    newOtp.forEach((char, i) => {
      inputRef.current[i].value = char;
    });
    inputRef.current[5].focus();
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const code = otp.join("");
    try {
      await verifyEmail(code);
      navigate("/dashboard"); // Redirect to dashboard after successful verification
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen w-full">
      <form
        onSubmit={submitHandler}
        onPaste={handlePaste}                            // ← paste listener here
        className="p-8 rounded-md w-full max-w-md flex flex-col gap-10 border border-gray-200"
      >
        <div className="text-center">
          <h1 className="font-extrabold text-2xl">Verify your email</h1>
          <p className="text-sm text-gray-600">
            Enter the 6 digit code sent to your email address
          </p>
        </div>
        <div className="flex justify-between">
          {otp.map((letter, idx) => (
            <Input
              key={idx}
              ref={(el) => (inputRef.current[idx] = el)}
              type="text"
              maxLength={1}
              defaultValue={letter}
              onChange={(e) => handleChange(idx, e.target.value)}
              onKeyDown={(e) => handleKeyDown(idx, e)}
              className="md:w-12 md:h-12 w-8 h-8 text-center text-sm md:text-2xl rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          ))}
        </div>
        <Button
          type="submit"
          className="bg-orange hover:bg-hoverOrange mt-6 w-full"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 w-4 h-4 animate-spin" />
              Please wait
            </>
          ) : (
            "Verify"
          )}
        </Button>
      </form>
    </div>
  );
};

export default VerifyEmail;
