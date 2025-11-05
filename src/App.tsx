
// import { TopNavBar } from './components/layout/TopNavBar';

// const App = () => {
//   return (
//     <>
//       <div className="min-h-screen bg-gray-100 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
//         < TopNavBar />
//       </div>
//     </>
//   );  
// };
// export default App;

import { Suspense } from "react";
import { useRoutes } from "react-router-dom";
import { appRoutes } from "./app/routes";

export default function App() {
  const element = useRoutes(appRoutes);

  return (
    <Suspense fallback={<div className="p-6">Loading...</div>}>
      {element}
    </Suspense>
  );
}
