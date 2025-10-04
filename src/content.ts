alert("Injected")
// ===== Tạo nút nổi bật / ẩn overlay =====
const toggleBtn = document.createElement("button")
toggleBtn.innerText = "Nomas"
toggleBtn.id = "nomas-toggle-btn"

Object.assign(toggleBtn.style, {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    zIndex: 1000000,
    padding: "10px 16px",
    background: "#1a1a1a",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontFamily: "system-ui",
    fontSize: "14px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.3)"
})

toggleBtn.addEventListener("mouseenter", () => {
    toggleBtn.style.background = "#333"
})

toggleBtn.addEventListener("mouseleave", () => {
    toggleBtn.style.background = "#1a1a1a"
})

// ===== Overlay container =====
const overlay = document.createElement("div")
overlay.id = "nomas-wallet-root"
Object.assign(overlay.style, {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    background: "rgba(0,0,0,0.5)",
    zIndex: 999999,
    display: "none" // ẩn mặc định
})

// Demo nội dung trong overlay
const box = document.createElement("div")
box.innerText = "Nomas Wallet Overlay"
Object.assign(box.style, {
    background: "white",
    color: "black",
    width: "300px",
    padding: "20px",
    borderRadius: "12px",
    margin: "100px auto",
    textAlign: "center",
    fontFamily: "system-ui"
})
overlay.appendChild(box)

// Sự kiện toggle
toggleBtn.addEventListener("click", () => {
    overlay.style.display = overlay.style.display === "none" ? "block" : "none"
})

// Thêm vào DOM
document.body.appendChild(toggleBtn)
document.body.appendChild(overlay)