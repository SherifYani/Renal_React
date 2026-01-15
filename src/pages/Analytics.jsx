import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ScatterChart,
  Scatter,
} from "recharts";
import {
  TrendingUp,
  PieChart as PieChartIcon,
  BarChart3,
  Activity,
  Calendar,
  Download,
  RefreshCw,
  Clock,
  AlertTriangle,
  DollarSign,
} from "lucide-react";
import LoadingState from "../components/common/LoadingState";

// Custom Tooltip components with dark theme support
const CustomTooltip = ({
  active,
  payload,
  label,
  formatter,
  labelFormatter,
}) => {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3">
      <p className="font-medium text-gray-900 dark:text-gray-100">
        {labelFormatter ? labelFormatter(label) : label}
      </p>
      {payload.map((entry, index) => (
        <div key={index} className="flex items-center justify-between mt-1">
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{
                backgroundColor: entry.color || entry.fill || entry.stroke,
              }}
            />
            <span className="text-sm text-gray-600 dark:text-gray-300">
              {entry.dataKey}
            </span>
          </div>
          <span className="font-medium text-gray-900 dark:text-gray-100 ml-4">
            {formatter
              ? formatter(entry.value, entry.dataKey, entry, index, payload)
              : typeof entry.value === "number"
              ? entry.value.toLocaleString()
              : entry.value}
          </span>
        </div>
      ))}
    </div>
  );
};

const CustomPieTooltip = ({ active, payload }) => {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3">
      <div className="flex items-center gap-2 mb-2">
        <div
          className="w-4 h-4 rounded-full"
          style={{ backgroundColor: payload[0].payload.color }}
        />
        <span className="font-medium text-gray-900 dark:text-gray-100">
          {payload[0].payload.name}
        </span>
      </div>
      <div className="text-sm text-gray-600 dark:text-gray-300">
        Value:{" "}
        <span className="font-medium text-gray-900 dark:text-gray-100">
          {payload[0].value.toLocaleString()}
        </span>
      </div>
      {payload[0].payload.percent && (
        <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">
          Percentage:{" "}
          <span className="font-medium text-gray-900 dark:text-gray-100">
            {(payload[0].payload.percent * 100).toFixed(1)}%
          </span>
        </div>
      )}
    </div>
  );
};

const Analytics = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [equipment, setEquipment] = useState([]);
  const [maintenance, setMaintenance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("30days");

  useEffect(() => {
    loadAnalyticsData();
  }, [timeRange]);

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);

      // Fetch all data from JSON Server
      const [equipmentRes, maintenanceRes, analyticsRes] = await Promise.all([
        fetch("http://localhost:3001/equipment"),
        // getEquipment(),
        fetch("http://localhost:3001/maintenance"),
        // getMaintenanceRequests(),
        fetch("http://localhost:3001/analytics"),
        // getAnalytics(),
      ]);

      const equipmentData = await equipmentRes.json();
      const maintenanceData = await maintenanceRes.json();
      const analytics = await analyticsRes.json();

      setEquipment(Array.isArray(equipmentData) ? equipmentData : []);
      setMaintenance(Array.isArray(maintenanceData) ? maintenanceData : []);
      setAnalyticsData(analytics);
      setLoading(false);
    } catch (err) {
      console.error("Error loading analytics data:", err);
    }
  };

  const prepareEquipmentStatusData = () => {
    if (!analyticsData?.equipmentStatus) return [];
    const statusData = analyticsData.equipmentStatus;
    return [
      {
        name: "Available",
        value: statusData.available,
        color: "#10b981",
        percent:
          statusData.available /
          (statusData.available + statusData.in_use + statusData.maintenance),
      },
      {
        name: "In Use",
        value: statusData.in_use,
        color: "#3b82f6",
        percent:
          statusData.in_use /
          (statusData.available + statusData.in_use + statusData.maintenance),
      },
      {
        name: "Maintenance",
        value: statusData.maintenance,
        color: "#f59e0b",
        percent:
          statusData.maintenance /
          (statusData.available + statusData.in_use + statusData.maintenance),
      },
    ];
  };

  const prepareMaintenancePriorityData = () => {
    const priorityCounts = {
      urgent: 0,
      high: 0,
      medium: 0,
      low: 0,
    };

    maintenance.forEach((item) => {
      if (item.priority && priorityCounts[item.priority] !== undefined) {
        priorityCounts[item.priority]++;
      }
    });

    const total = Object.values(priorityCounts).reduce((a, b) => a + b, 0);

    return [
      {
        name: "Urgent",
        value: priorityCounts.urgent,
        color: "#ef4444",
        percent: total > 0 ? priorityCounts.urgent / total : 0,
      },
      {
        name: "High",
        value: priorityCounts.high,
        color: "#f97316",
        percent: total > 0 ? priorityCounts.high / total : 0,
      },
      {
        name: "Medium",
        value: priorityCounts.medium,
        color: "#eab308",
        percent: total > 0 ? priorityCounts.medium / total : 0,
      },
      {
        name: "Low",
        value: priorityCounts.low,
        color: "#3b82f6",
        percent: total > 0 ? priorityCounts.low / total : 0,
      },
    ];
  };

  const prepareDepartmentEfficiency = () => {
    if (!analyticsData?.departmentUtilization) return [];

    return analyticsData.departmentUtilization.map((dept) => ({
      department: dept.department,
      utilization: dept.utilization,
      equipmentCount: dept.totalEquipment || 0,
      availability: dept.available || 0,
    }));
  };

  const prepareMaintenanceCostData = () => {
    const monthlyCosts = [
      { month: "Sep", cost: 2450, requests: 12 },
      { month: "Oct", cost: 3120, requests: 15 },
      { month: "Nov", cost: 2890, requests: 14 },
      {
        month: "Dec",
        cost: analyticsData?.maintenanceCosts?.currentMonth || 1735,
        requests: 15,
      },
    ];
    return monthlyCosts;
  };

  const prepareEquipmentTypeDistribution = () => {
    const typeCounts = {};

    equipment.forEach((item) => {
      if (item.type) {
        typeCounts[item.type] = (typeCounts[item.type] || 0) + 1;
      }
    });

    return Object.entries(typeCounts).map(([type, count], index) => ({
      type,
      count,
      color: [
        "#3b82f6",
        "#10b981",
        "#8b5cf6",
        "#f59e0b",
        "#ef4444",
        "#ec4899",
        "#06b6d4",
      ][index % 7],
      percent: count / equipment.length,
    }));
  };

  const prepareUtilizationTrend = () => {
    if (!analyticsData?.dailyUsage) return [];

    // Filter based on timeRange
    const data = [...analyticsData.dailyUsage];
    if (timeRange === "7days") {
      return data.slice(-7);
    } else if (timeRange === "30days") {
      return data;
    }
    return data;
  };

  const prepareMaintenanceCompletionTime = () => {
    const completedMaintenance = maintenance.filter(
      (m) => m.status === "completed" && m.dateCompleted && m.dateReported
    );

    return completedMaintenance.map((item) => {
      const reported = new Date(item.dateReported);
      const completed = new Date(item.dateCompleted);
      const hours = Math.abs(completed - reported) / 36e5; // Convert ms to hours

      return {
        equipmentId: item.equipmentId,
        equipmentName:
          equipment.find((e) => e.id === item.equipmentId)?.name || "Unknown",
        hours: Math.round(hours),
        priority: item.priority,
        issueType: item.issueType,
      };
    });
  };

  const formatTooltipValue = (value, name) => {
    if (name === "utilization") return [`${value}%`, "Utilization"];
    if (name === "cost") return [`$${value.toLocaleString()}`, "Cost"];
    if (name === "requests") return [value, "Requests"];
    if (name === "availability") return [value, "Available"];
    if (name === "equipmentCount") return [value, "Equipment"];
    return [value, name];
  };

  const exportData = () => {
    const dataStr = JSON.stringify(analyticsData, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(
      dataStr
    )}`;

    const exportFileDefaultName = `hospital-analytics-${
      new Date().toISOString().split("T")[0]
    }.json`;

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };
  // Loading state
  if (loading) {
    return <LoadingState message="Loading analytics data..." />;
  }

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Equipment Analytics
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Comprehensive insights and performance metrics
          </p>
        </div>
        <div className="flex gap-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent">
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
            </select>
          </div>
          <button
            onClick={loadAnalyticsData}
            className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg transition-colors duration-200">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
          <button
            onClick={exportData}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-lg transition-colors duration-200">
            <Download className="w-4 h-4" />
            Export Data
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Total Equipment
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {equipment.length}
              </p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Activity className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Across {analyticsData?.departmentUtilization?.length || 0}{" "}
            departments
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Average Utilization
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {analyticsData?.utilizationTrends?.weeklyAverage || 0}%
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Peak: {analyticsData?.utilizationTrends?.peakUtilization || 0}%
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Active Maintenance
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {analyticsData?.maintenanceStats?.active || 0}
              </p>
            </div>
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {analyticsData?.maintenanceStats?.urgent || 0} urgent requests
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Maintenance Cost
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                $
                {analyticsData?.maintenanceCosts?.currentMonth?.toLocaleString() ||
                  "0"}
              </p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <DollarSign className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            This month
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Utilization Trend */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-600" />
              Utilization Trend
            </h2>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={prepareUtilizationTrend()}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e5e7eb"
                strokeOpacity={0.3}
                vertical={false}
              />
              <XAxis
                dataKey="date"
                stroke="#9ca3af"
                tick={{ fill: "#6b7280" }}
                tickFormatter={(value) =>
                  new Date(value).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })
                }
              />
              <YAxis stroke="#9ca3af" unit="%" tick={{ fill: "#6b7280" }} />
              <Tooltip
                content={<CustomTooltip formatter={formatTooltipValue} />}
              />
              <Line
                type="monotone"
                dataKey="utilization"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ r: 4, strokeWidth: 2, stroke: "#3b82f6", fill: "white" }}
                activeDot={{
                  r: 6,
                  strokeWidth: 2,
                  stroke: "#3b82f6",
                  fill: "white",
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Equipment Status Distribution */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <PieChartIcon className="w-5 h-5 text-green-600" />
              Equipment Status Distribution
            </h2>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={prepareEquipmentStatusData()}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="value">
                {prepareEquipmentStatusData().map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomPieTooltip />} />
              <Legend
                wrapperStyle={{ fontSize: "14px" }}
                formatter={(value) => (
                  <span className="text-gray-700 dark:text-gray-300">
                    {value}
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Department Efficiency */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-purple-600" />
              Department Efficiency
            </h2>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={prepareDepartmentEfficiency()}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e5e7eb"
                strokeOpacity={0.3}
                vertical={false}
              />
              <XAxis
                dataKey="department"
                stroke="#9ca3af"
                tick={{ fill: "#6b7280" }}
              />
              <YAxis stroke="#9ca3af" unit="%" tick={{ fill: "#6b7280" }} />
              <Tooltip
                content={<CustomTooltip formatter={formatTooltipValue} />}
              />
              <Bar dataKey="utilization" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Maintenance Priority */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              Maintenance Priority Distribution
            </h2>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={prepareMaintenancePriorityData()}>
              <PolarGrid stroke="#e5e7eb" strokeOpacity={0.3} />
              <PolarAngleAxis
                dataKey="name"
                stroke="#9ca3af"
                tick={{ fill: "#6b7280" }}
              />
              <PolarRadiusAxis stroke="#9ca3af" tick={{ fill: "#6b7280" }} />
              <Radar
                name="Maintenance"
                dataKey="value"
                stroke="#ef4444"
                fill="#ef4444"
                fillOpacity={0.6}
              />
              <Tooltip content={<CustomPieTooltip />} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Maintenance Costs Trend */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              Maintenance Costs & Requests Trend
            </h2>
          </div>
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={prepareMaintenanceCostData()}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e5e7eb"
                strokeOpacity={0.3}
                vertical={false}
              />
              <XAxis
                dataKey="month"
                stroke="#9ca3af"
                tick={{ fill: "#6b7280" }}
              />
              <YAxis
                yAxisId="left"
                stroke="#9ca3af"
                tick={{ fill: "#6b7280" }}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke="#9ca3af"
                tick={{ fill: "#6b7280" }}
              />
              <Tooltip
                content={<CustomTooltip formatter={formatTooltipValue} />}
              />
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="cost"
                stroke="#10b981"
                fill="#10b981"
                fillOpacity={0.3}
                strokeWidth={2}
                name="Cost"
              />
              <Area
                yAxisId="right"
                type="monotone"
                dataKey="requests"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.3}
                strokeWidth={2}
                name="Requests"
              />
              <Legend
                wrapperStyle={{ fontSize: "14px" }}
                formatter={(value) => (
                  <span className="text-gray-700 dark:text-gray-300">
                    {value}
                  </span>
                )}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Equipment Type Distribution */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm lg:col-span-1">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            Equipment by Type
          </h3>
          <div className="space-y-3">
            {prepareEquipmentTypeDistribution().map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-gray-700 dark:text-gray-300">
                    {item.type}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900 dark:text-white">
                    {item.count}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    ({((item.count / equipment.length) * 100).toFixed(1)}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Maintenance Completion Times */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Maintenance Resolution Times
            </h3>
            <Clock className="w-5 h-5 text-gray-400 dark:text-gray-500" />
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <ScatterChart>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e5e7eb"
                strokeOpacity={0.3}
              />
              <XAxis
                dataKey="hours"
                type="number"
                name="Hours"
                stroke="#9ca3af"
                tick={{ fill: "#6b7280" }}
                label={{
                  value: "Hours to Resolve",
                  position: "insideBottom",
                  offset: -5,
                  fill: "#6b7280",
                }}
              />
              <YAxis
                dataKey="priority"
                type="category"
                stroke="#9ca3af"
                tick={{ fill: "#6b7280" }}
                padding={{ top: 20, bottom: 20 }}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload || !payload.length) return null;

                  const data = payload[0].payload;
                  return (
                    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3">
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        {data.equipmentName}
                      </p>
                      <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                        Issue:{" "}
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {data.issueType}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        Priority:{" "}
                        <span
                          className={`font-medium ${
                            data.priority === "urgent"
                              ? "text-red-600 dark:text-red-400"
                              : data.priority === "high"
                              ? "text-orange-600 dark:text-orange-400"
                              : data.priority === "medium"
                              ? "text-yellow-600 dark:text-yellow-400"
                              : "text-blue-600 dark:text-blue-400"
                          }`}>
                          {data.priority}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        Resolution Time:{" "}
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {data.hours} hours
                        </span>
                      </div>
                    </div>
                  );
                }}
              />
              <Scatter
                name="Maintenance Requests"
                data={prepareMaintenanceCompletionTime()}
                fill="#3b82f6"
                shape="circle"
              />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
