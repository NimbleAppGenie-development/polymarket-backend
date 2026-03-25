import { Paper, Typography, Box } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import Loader from "../components/Loader";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

export default function Dashboard() {

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchDashboard = async () => {

    setLoading(true);

    try {

      const token = localStorage.getItem("UserToken");

      const res = await axios.get(
        `${apiBaseUrl}/api/admin/dashboard`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setData(res?.data?.result || {});

    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }

  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading || !data) {
    return <Loader open={true} />;
  }

  const stats = [

    { label: "Users", value: data.totalUsers, color: "#1976d2" },

    { label: "Products", value: data.totalProducts, color: "#6a1b9a" },

    { label: "Categories", value: data.totalCategories, color: "#00838f" },

    { label: "Collections", value: data.totalCollections, color: "#5d4037" },

    { label: "Orders", value: data.totalOrders, color: "#d32f2f" },

    { label: "Orders Today", value: data.ordersToday, color: "#2e7d32" },

    { label: "Active Carts", value: data.usersWithCart, color: "#ef6c00" },

    { label: "Trending Products", value: data.trendingProducts, color: "#4527a0" },

    { label: "Revenue", value: `₹${data.totalRevenue}`, color: "#1b5e20" }

  ];

  return (
    <>

      <Box
        sx={{
          padding: "30px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
          gap: "20px"
        }}
      >

        Dashboard
        {/* {stats.map((item) => (
          <Paper
            key={item.label}
            elevation={4}
            sx={{
              padding: "20px",
              background: item.color,
              color: "#fff",
              borderRadius: "10px",
              textAlign: "center"
            }}
          >

            <Typography variant="h6">{item.label}</Typography>

            <Typography variant="h4" fontWeight="bold">
              {item.value}
            </Typography>

          </Paper>
        ))} */}

      </Box>
    </>
  );

}