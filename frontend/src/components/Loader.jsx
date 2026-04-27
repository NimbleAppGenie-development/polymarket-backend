import { Oval } from "react-loader-spinner";

export default function Loader({ color }) {
  return (
    <div
      className="loader-overlay"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(48, 48, 48, 0.8)",
        
        zIndex: 99999, // higher than modals, tables, etc.
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Oval
        visible={true}
        height="80"
        width="80"
        color={color ?? "white"}
        secondaryColor="#101218"
        ariaLabel="loading"
      />
    </div>
  );
}
