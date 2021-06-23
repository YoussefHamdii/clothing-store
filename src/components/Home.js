
import 'bootstrap/dist/css/bootstrap.min.css';

function Home() {
  return (
    <div className="homePage_background">
        <img src={process.env.PUBLIC_URL+"/assets/i1.jpg"} alt="middle" className="center"/>
    </div>
  );
}

export default Home;
