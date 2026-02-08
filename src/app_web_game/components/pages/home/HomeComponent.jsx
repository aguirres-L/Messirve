import HeaderComponent from "./component_home/Header.jsx";
import FooterComponent from "./component_home/FooterComponent.jsx";
import ContainerComponent from "./component_home/ContainerComponent.jsx";

export default function HomeComponent() {
  return (
    <div className="min-h-screen flex flex-col">
      <HeaderComponent />
      <ContainerComponent />
      <FooterComponent />
    </div>
  );
}