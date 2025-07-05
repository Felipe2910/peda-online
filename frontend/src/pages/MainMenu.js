import Header from "../components/Header";
import Footer from "../components/Footer";
export default function MainMenu() {
	return (
		<>
			<Header />
			<section className="container">
				<div id="main_menu">
					<div className="user_info">
						<img
							className="user_icon"
							src="/media/Nintendo_Switch_Link_TP_Icon.png"
							alt="User Icon"
						/>
						<button className="btn-txt" disabled>
							Cambiar
						</button>
						<div className="input-wrapper">
							<input type="text" placeholder="Username" />
						</div>
					</div>
					<div className="room_info">
						<div className="input-wrapper">
							<input type="text" placeholder="Room ID" disabled />
						</div>
					</div>
					<div className="room_buttons">
						<button className="btn-txt" disabled>
							Unirse a Sala
						</button>
						<button className="btn-txt">Crear Sala</button>
					</div>
					<div>
						<a href="/rules">Ir a Reglas</a>
					</div>
				</div>
			</section>
			<Footer />
		</>
	);
}
