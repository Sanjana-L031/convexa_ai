import { useState } from "react";
import axios from "axios";

export default function Campaign() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const triggerCampaign = async () => {
    try {
      setLoading(true);

      const res = await axios.post(
        "http://127.0.0.1:5000/api/campaign/trigger",
        {
          name: "Rahul",
          cartItems: ["Nike Shoes"],
          cartValue: 2500,
          phone: "91XXXXXXXXXX"
        }
      );

      setMessage(res.data.message);
    } catch (err) {
      console.error(err);
      alert("Error connecting backend");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Campaign Builder</h1>

      <button onClick={triggerCampaign}>
        {loading ? "Sending..." : "Run Campaign"}
      </button>

      <h3>Generated Message:</h3>
      <p>{message}</p>
    </div>
  );
}