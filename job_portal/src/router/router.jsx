import Home from '../components/home';
import App from './App';
import { createBrowserRouter } from 'react-router-dom'

const router = createBrowserRouter([
{
    path: "/",
    element: <App/>,
    // children:[
    //     {
    //         path:"/",
    //         element:<Home/>
    //     }
    // ]
},
]); 

export default router;