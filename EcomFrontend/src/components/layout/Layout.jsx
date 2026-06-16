import Navbar from './Navbar/Navbar';
import Footer from './Footer/Footer';

const Layout = ({ children }) => (
  <>
    <Navbar />
    <main className='main-content'>
      {children}
    </main>
    <Footer />
  </>
);

export default Layout;
