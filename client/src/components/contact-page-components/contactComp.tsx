import { useState } from "react";
import { toast } from "react-hot-toast";
import LoadingButton from "../Button/LoadingButton";
import axios from "axios";
import CustomButton from "../Button/customButton";

interface ContactCompProps {
  title?: string;
  desc?: string;
}

const ContactComp: React.FC<ContactCompProps> = ({ title, desc }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (name.length === 0) {
      toast.error("Please enter your name");
      return;
    }
    if (
      email.length === 0 ||
      !email.includes("@") ||
      email.includes(" ") ||
      !email.includes(".") ||
      email.includes("@.")
    ) {
      toast.error("Please enter a valid email");
      return;
    }
    if (message.length === 0) {
      toast.error("Please enter your message");
      return;
    }

    setSubmitting(true);
    try {
      await axios.post(`http://localhost:4000/contact`, {
        name,
        email,
        message,
      });
      toast.success("Message sent successfully");
      setName("");
      setEmail("");
      setMessage("");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="w-[900px] h-full mt-9 md:mt-0  md:flex items-center justify-center  px-10 "

    >

      <div className="flex flex-col border-[1px] border-[#919293] md:flex-row items-center md:items-end bg-white rounded-lg shadow-lg p-8 md:p-12 gap-12 w-full md:w-[60%]">
        {/* Left Section */}
       
         
        {/* Right Section - Form */}
        <form onSubmit={handleSubmit} className="w-full">
        <h1 className="font-[500] text-[20px] mb-6">Reach out to us!</h1>
          <div className="flex flex-col gap-6">
            <div>
            <p className="text-[14px] mb-[6px]">Name</p>
            <input
              className="shadow-md border rounded-lg w-full py-3 px-4 text-gray-700 placeholder-gray-500 bg-[#EFF0F0] focus:outline-none focus:ring-2 focus:ring-[#CCCDCF]"
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            </div>
            <div>
              <p className="text-[14px] mb-[6px]">Phone Number</p>
            <input
              className="shadow-md border bg-[#EFF0F0] rounded-lg w-full py-3 px-4 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#CCCDCF]"
              type="text"
              placeholder="Phone Number"
            />
            </div>
            <div>
              <p className="text-[14px] mb-[6px]">Email</p>
            <input
              className="shadow-md border bg-[#EFF0F0] rounded-lg w-full py-3 px-4 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#CCCDCF]"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            </div>
            <div>
              <p  className="text-[14px] mb-[6px]">Message</p>
            <textarea
              className="shadow-md border bg-[#EFF0F0] rounded-lg w-full py-3 px-4 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#CCCDCF] min-h-[120px]"
              placeholder="Message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            ></textarea>
            </div>

            <div className="mt-4">
              <CustomButton
                isLoading={false}
                text="Submit"
                type="submit"
                onClick={() => console.log("Button clicked!")}
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactComp;
