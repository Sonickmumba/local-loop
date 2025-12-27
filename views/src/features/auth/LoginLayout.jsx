import { Outlet, useNavigate } from 'react-router-dom';
import { ImageWithFallback } from './ImageWithFallback';

import { Link } from 'react-router-dom';

export const LoginLayout = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-12">
          <div className="text-5xl mb-6">🎉</div>
          <h1>LocalLoop</h1>
          <p className="text-xl text-gray-600">Connect with your neighborhood</p>
        </div>

        <div className="bg-gray-50 border rounded-lg p-10 mb-10">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1531545514256-b1400bc00f31?w=800"
            className="w-full h-64 object-cover rounded-lg"
          />
        </div>

        <Outlet />

        <div className="text-center mt-8">
          <button onClick={() => navigate('signup')} className="mr-4 text-blue-600">
            Sign up
          </button>
          <button onClick={() => navigate('signin')} className="text-blue-600">
            Sign in
          </button>
        </div>
      </div>
    </div>

    

    // <div className="min-h-screen flex items-center justify-center p-6">
    //   <div className="w-full max-w-2xl">
    //     <div className="text-center mb-12">
    //       <div className="text-5xl mb-6">🎉</div>
    //       <h1 className="mb-4">LocalLoop</h1>
    //       <p className="text-xl text-gray-600">
    //         Connect with your neighborhood
    //       </p>
    //     </div>

    //     <div className="bg-gray-50 border-2 border-gray-300 rounded-lg p-12 mb-8 relative">
    //       <ImageWithFallback
    //         src="https://images.unsplash.com/photo-1531545514256-b1400bc00f31?w=800&auto=format&fit=crop"
    //         alt="People exchanging services"
    //         className="w-full h-64 object-cover rounded-lg mb-4"
    //       />
    //       <p className="text-center text-gray-600">
    //         People exchanging services
    //       </p>

    //       <button className="absolute bottom-4 right-4 bg-white px-6 py-3 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors flex items-center gap-2 shadow-sm">
    //         Ask 🙋
    //       </button>
    //     </div>

    //     <p className="text-center text-lg text-gray-700 mb-12">
    //       Trade skills, share goods,
    //       <br />
    //       build community
    //     </p>

        

    //     <button
    //         onClick={() => navigate('signup')}
    //       className="w-full bg-white border-2 border-gray-900 py-4 rounded-lg hover:bg-gray-50 transition-colors mb-6"
    //     >
    //       GET STARTED TO SIGNUP
    //     </button>

        

    //     <p className="text-center text-gray-600">
    //       Already have an account?{' '}
    //       <button
    //         // onClick={() => setView('signin')}
    //         // onClick={() => navigate('signin')}
    //         onClick={() => navigate('/login/signin')}
    //         className="text-blue-600 hover:underline"
    //       >
    //         Sign in →
    //       </button>
    //     </p>
    //   </div>
    // </div>








    







  );
};
