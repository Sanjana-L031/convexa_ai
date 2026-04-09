import { LineChart, Line, XAxis, YAxis, Tooltip } from "recharts";

const data = [
  { day: "Mon", revenue: 5000 },
  { day: "Tue", revenue: 8000 },
  { day: "Wed", revenue: 12000 }
];

export default function Analytics() {
  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="mb-4 font-semibold">Revenue</h2>

      <LineChart width={500} height={300} data={data}>
        <XAxis dataKey="day" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="revenue" />
      </LineChart>
    </div>
  );
}