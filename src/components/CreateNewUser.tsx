import { Badge, Button, Card, TextInput, Title } from "@tremor/react";
import { useState } from "react";
import { useUserActions } from "../hooks/useUserActions";

export const CreateNewUser = () => {
	const { addUser } = useUserActions();
	const [result, setResult] = useState<"ko" | "ok" | null>(null);

	const handleSubmit = (event: React.FormEvent<HTMLFormEvent>) => {
		event.preventDefault();

		const form = event.target;
		const formData = new FormData(form);

		const name = formData.get("name") as string;
		const email = formData.get("email") as string;
		const github = formData.get("github") as string;

		if (!name || !email || !github) return setResult("ko");

		addUser({ name, email, github });
		setResult("ok");

		form.reset(); // resetea los textinput de un form
	};

	return (
		<Card style={{ marginTop: "16px" }}>
			<Title>Create New User</Title>

			<form className="" onSubmit={handleSubmit}>
				<TextInput name="name" placeholder="Nombre" />
				<TextInput name="email" placeholder="Email" />

				<TextInput name="github" placeholder="Github username" />

				<div>
					<Button type="submit" style={{ marginTop: "16px" }}>
						Crear usuario
					</Button>

					<span>
						{result === "ok" && (
							<Badge color='green'>Guardado correctamente</Badge>
						)}
						{result === "ko" && <Badge color='red'>Error con los datos</Badge>}
					</span>
				</div>
			</form>
		</Card>
	);
};
