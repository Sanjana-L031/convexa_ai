import Card from "../components/Card";

export default function Dashboard() {
  return (
    <div className="grid grid-cols-4 gap-4">
      <Card title="Revenue" value="₹75,000" />
      <Card title="Conversions" value="320" />
      <Card title="CTR" value="18%" />
      <Card title="Users" value="1,200" />
    </div>
  );
}