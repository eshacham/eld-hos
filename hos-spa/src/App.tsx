
import { HosStatusCard } from "./components/HosStatusCard";

import { UpdateHosForm } from "./components/UpdateHosForm";

export default function App() {

  return (

    <>

      <UpdateHosForm />

      <hr style={{margin:"2rem 0"}}/>

      <HosStatusCard driverId="3fa85f64-5717-4562-b3fc-2c963f66afa6" />

    </>

  );

}

