
import 'bootstrap/dist/css/bootstrap.min.css';

function Home() {
  return (
    <div className="homePage_background">
      <div className="homepage__container">
        <img src={process.env.PUBLIC_URL+"/assets/i1.jpg"} alt="middle" className="center"/>
        <span>Welcome to <span className="orange">Drip!!!</span></span>
        </div>
    </div>
  );
}

export default Home;
