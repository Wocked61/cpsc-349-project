
import "./Home.css";

import Footer from "./Footer";

function Home() {


return (
    <div className="home-container">
      <main className="content">
        <h1>Welcome to Regional Cloud</h1>
        <p>This app allows you to view timezones and weather information.</p>
        <p>Use the navigation bar to explore different features.</p>
      </main>
      <Footer />
    </div>
  );
}



export default Home;