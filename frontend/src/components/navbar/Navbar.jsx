import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    
    const loggedInUser = localStorage.getItem('user');
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser));
    }
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = async () => {
    try {
   
      await axios.post('http://localhost:9000/auth/logout');
      
     
      localStorage.removeItem('user');
      setUser(null);
      
     
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <Link to="/">
           <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAwFBMVEX///9Bpe4AUowAd8xYre8ASoji6fCEob4Ac8vi7fiEs+EAUIsAdcsAcMo1oe0tn+0AbMlHqO8ARYWr1PcAR4b0+v4AQYPX6/t5vPIlne1IeaTv9PgAfM4AasjD4PmczfVis/CGwvOYy/XV4eoQW5KswNOXv+ZYnNmKuONxqN2z0u3I3vJ0mLkzZZc6a5pbiK68zNvN2+abs8qRrMZTf6drj7Kit804i9Nko9tLldY/j9WszOsSgdB7nbzo8vqXvOR9F6KNAAAGQUlEQVR4nO3da1fiMBAGYApUwd5ooRSly00uqyuKqIu4LPv//9W2QFEwbWZqj004836n9jmZJI00pFD4rrhevd8r24pd7g3qnvttf/eb4nZaimWayjamaSmtzikh3a5tRboopmUPTsbYNY95UVN28761TOLZbN/GqHh5397X0433hbGkb8aWlQgMmrGV9y1+Lb3kFtwQe3nf5FcCAMpNbEGAAbGf942mTZ3XB6NY9bxvNV28SyBQUS7lnDTKYKCilPO+2TSpwzrhNqaEderaCKCi2PI9o6KaUMpGxPTCMNL1RA86U0SxZBtO+7gilXDaR/rC5H3LuKyxRRqUaTXvm0algy3SoEw7ed80KoMUwkHeN40KcFVxIJRrKQxaGB4Je3nfNCrY+T6MXHM+CUkofkhIQvFDQhKKHxKSUPyQkITih4QkFD8kJKH4ISEJxQ8JSSh+SEhC8UNCEoofEpJQ/JCQhOKHhCQUPyQkofghIQlziOuiNibJJbwe3V1Nh8Ph9P7hadaGfUYi4eOL6jRUbRtVdZzpHIKUReiOpk21eBit0Xy55n5SEuFo6mhFRlT1Yc35qBTC9hXbF7ajqs6TPyyDcOYc1+dBnOfE7iiB8MlJ8oWlOjxL+Lj4wr+xFfpeqsOEAUd44TmvBTfEYnwrii6cQ4BhK8b2RcGFj4ljzIeoV3IK3SG3D0ZxnqQU3jWgwKAVY0YboYXXTTiwqD5LKHwG1+imTh+lE143UEKNPdiILHyBDqS7NJk9UWBhu4hqwqAnnksmnMEm+/doQ8mEd8gijZkwBBbCZ/sojd9SCduYyXDXhg9SCR+x3TDoiPdSCUcphKwVhrjCOeKZdB/GMlFc4Tl6KC1q2skLVRKSkIQkJCEJSUhCEpKQhCQkIQlJSEISkpCEJCQhCUlIQhKSkIQkJCEJSUhCEpKQhCQkIQlJSEISkjBnoesif8ZCJuH69mKyWPm+v1jejD00U3TherzQjUpF36ZiGP7rr1MSehPD0PXSxwRKf3wqwuqkVikxohv+7UkIxzrTtzUueT/UIb7QXRp6HDBIRYc2o6jCaim2AXfNWPsptdArJTXgNrULiYVVADAgglpRSGHbhwBLJQMybQgpfOP0wSi6AZj9RRT+NGDAgLjiP8QJKKxWYDW6qdMbGYVLYI1uUvPkE/6qIYClylI+4Ru8Rjd1ymtE4YQeqgmDRuT1ROGEF5heGET3OcOpcELgZP8eg/MILprQA8+FUXhlKppwjBbqK7mEE2Q3DPIjeTEsmnCB7YZBR0x+OBVM2F6lEP6RSbgGLQyPhP9kEmKeuvfC5IWwcEI0sFRJ/m8GCUlIQhKSkIQkJCEJSUhCEpKQhCQkIQlJSMJshE+iCTP/f2lWv5TcM9FAs/f5Mqn+55383lBWv3bdSiFsfb6Mm/33Fml+sZx1wkU3hbDLuA7yPYUwteTvnrL61flOCmGHcZ3XFN8fcr7Iz+jkgLWFFlpVxnWy/w44q9MfCmigorAuk/33+Pihhn2CR6GPLVOzz7xO5u9iFNrYMmWfwlLwsGVqsV9mukA2Ivd9mqxO0sHP+THv7Xk/cEJukYaHrmVxGlKhUMeVqVmPuc4y4/fagjyjGrHJPtEqmKxtlNCOKy7ku4kTPjCbU8kKyEaMbULkKzU11pTzKX8zOFkuDKYnJu1EyPYd4TCY0wHZA+nu1i7BwMuk3pPte96bZHDC4yZ16IxhxddoGOh70DpkmNnm95dP6dwGuMKImez3Ae+3SF5VHOQJMtoknbS6C2iZyFoYHibLPTNR/jb5p+Vq/OO5IUQ+MOjSOpeoA/c97TPnHQicfOLxPi1eX2QtfD9n7fP2roG2BB1kVvzKqdXv4ayFLda6l5H2JHn/YQmxjTTK2XN8paoO5+TxD/HseKNpg0e/YKkYv4e0Bt9DepDZMOb0eId7evxBuibbaDL/cRGb9cRgTv66sUrRgLuMps7Rg7imNdQHwBBzELdrW8dI07IH2M303qt+XKt6xVggJglGHu+GzYaqadpGpzrO1Rw0whzF7bQUa9+UpmkprU6a30Sojt+McMd66Az349f8G+R+fFbORudX02GxOLx/mc+A4wsrXr3fK9uKXe4N6vDu9ynu7b/Xxcov+YvJxR/Ag/Z/+GTn6EG3mXEAAAAASUVORK5CYII=" alt="" />
          </Link>
        </div>

        <div className="menu-icon" onClick={toggleMenu}>
          <div className={`hamburger ${isOpen ? 'active' : ''}`}>
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </div>
        </div>
        
        <div className={`nav-auth ${isOpen ? 'active' : ''}`}>
          {user ? (
            <>
              <Link to="/profile" className="profile-button">Profile</Link>
              <p className="profile-button"> {user.username}</p>
              <button onClick={handleLogout} className="logout-button">Logout</button>
            </>
          ) : (
            <>
              <Link to="/loginpage" className="login-button">Login</Link>
              <Link to="/registerpage" className="register-button">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;