
import 'bootstrap/dist/css/bootstrap.min.css';

function Home() {
  return (
    <div className="homePage_background">
      <div className="homepage__container">
       <span>Welcome to a new <span className="orange">life!!!</span></span>
        <img src={process.env.PUBLIC_URL+"/assets/i1.jpg"} alt="middle" className="center"/>
        </div>
    </div>
  );
}

export default Home;
