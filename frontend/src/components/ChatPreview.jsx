export default function ChatPreview({ message }) {
  return (
    <div className="bg-green-100 p-6 rounded-xl shadow">
      <h2 className="mb-4 font-semibold">WhatsApp Preview</h2>

      <div className="bg-white p-4 rounded-lg max-w-xs">
        <p>{message || "Your AI message will appear here..."}</p>
      </div>
    </div>
  );
}