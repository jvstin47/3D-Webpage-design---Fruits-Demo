import { Suspense } from 'react';
import { Experience } from './components/Experience';
import { Interface } from './components/UI/Interface';
import { Loader } from '@react-three/drei';

function App() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-orchard-light">
      <Suspense fallback={null}>
        <Experience />
      </Suspense>
      <Interface />
      <Loader 
        containerStyles={{ backgroundColor: '#e8f3e8' }}
        innerStyles={{ width: '300px', backgroundColor: '#a9a9a9' }}
        barStyles={{ backgroundColor: '#2c5530' }}
        dataStyles={{ color: '#2d3748', fontFamily: 'Inter' }}
      />
    </div>
  );
}

export default App;
