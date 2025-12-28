export default function Logo({ size = "nav", className = "" }) {
  const sizeClass = size === "footer" ? "footer-logo-text" : "nav-logo-text";
  
  return (
    <span className={`logo-container ${className} ${sizeClass}`}>
      <h1 id="red">McKim</h1>
      <h1 id="purple">Design</h1>
      <h1 id="yellow">Group</h1>
    </span>
  );
}