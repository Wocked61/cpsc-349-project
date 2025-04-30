
import "./Home.css";

import Footer from "./Footer";

function Home() {


return (
    <div className="home-container"
    style={{
      backgroundImage: "linear-gradient(rgba(135, 206, 235, 0.3), rgba(135, 206, 235, 0.3)), url('https://images.pexels.com/photos/186980/pexels-photo-186980.jpeg?cs=srgb&dl=pexels-tahir-shaw-50609-186980.jpg&fm=jpg')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat"
    }}>
      <main className="content">
        <div className="box">
        <h1 className="text">Welcome to Regional Cloud</h1>
        <p className="text">This app allows you to view timezones and weather information.</p>
        <p className="text">Use the navigation bar to explore different features.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}



export default Home;