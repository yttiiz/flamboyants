// deno-fmt-ignore-file
import { oak } from "@deps";
import * as layout from "@components";
import { Helper, Http } from "@utils";
import {
	BookingUserInfoType,
	Mongo,
	ProductFullDataType,
	ProductSchemaWithIDType,
} from "@mongo";
import type {
	PathAppType,
	ConfigPageType,
	RouterAppType,
	RouterContextAppType,
	ConfigMainHtmlType,
	DataResponseType,
	SessionAndDataType,
	SessionType,
} from "./mod.ts";

export class DefaultController {
	private ERROR_CODE = "Code erreur : 502";
	private isConnexionToDBFailed = (data: unknown) =>
		typeof data === "string" && data.includes(this.ERROR_CODE);

	protected MAX_SIZE = 10_000_000;

	public defaultImg = "/img/users/default.png";
	public errorMsg = `Impossible de se connecter à la base de données. ${this.ERROR_CODE}`;
	public sessionFlashMsg = (email: string) =>
		`connexion réussie pour : ${email}`;
	public router;

	constructor(router?: RouterAppType) {
		router ? (this.router = router) : null;
	}

	public response<T extends PathAppType>(
		ctx: RouterContextAppType<T> | oak.Context,
		data: DataResponseType,
		status: number,
		redirect?: string,
	) {
		const http = new Http(ctx);

		http.setHeaders({
			name: "Content-Type",
			value:
				status === 200 || status === 404
					? "text/html; charset=UTF-8"
					: "application/json",
		});

		data = typeof data === "string" ? data : JSON.stringify(data);

		if (redirect) {
			const url = new URL(redirect, Deno.env.get("APP_URL"));

			http.redirect(url).setResponse(data, status);
		} else {
			http.setResponse(data, status);
		}
	}

	public async createHtmlFile<T extends string>(
		ctx: RouterContextAppType<T> | oak.Context,
		{ id, css, data, title, path }: ConfigPageType,
	) {
		const appData = {
			session: ctx.state.session,
			isConnexionFailed: this.isConnexionToDBFailed(data),
			isAdminInterface: id.includes("admin"),
		};

		let [html, header, main, footer] = await this.createComponents(
			appData,
			"Body",
			"Header",
			"Main",
			"Footer",
		);

		html = this.setTitle(html, title);
		html = this.setCss(html, css);
		main = await this.setMainHtml({
			main,
			id,
			data,
			path,
			isUserConnected: (ctx.state.session as SessionType).has("userId"),
		});

		const content = "\n" + header + "\n" + main + "\n" + footer + "\n";

		html = html.replace("{{ application-content }}", content);
		html = this.setScript(html, id, data);

		return html;
	}

	private async createComponents(
		appData: SessionAndDataType,
		...args: (layout.TemplateNameType | "Body")[]
	) {
		const components = [];

		for (const arg of args) {
			arg === "Main"
				? components.push(layout[arg].html)
				: arg === "Header"
				? components.push(
						layout[arg].html({ ...appData, data: await this.getHeaderData() }),
				  )
				: components.push(layout[arg].html(appData));
		}

		return components;
	}

	private async getHeaderData() {
		const defaultLinks = [{ link: "/", text: "Accueil" }];

		try {
			const headerItems: { link: string; text: string; className: string }[] = [];
			const cursor = Mongo.connectionTo<ProductSchemaWithIDType>(
				"products",
			);

			if (!("message" in cursor)) {
				await cursor.map((document) => {
					headerItems.push({
						link: "/product/" + document._id.toString(),
						text: document.name,
						className: "header-" + document.name.toLocaleLowerCase(),
					});
				});

				return headerItems;
			}

			return defaultLinks;
		} catch (error) {
			Helper.writeLog(error);
			return defaultLinks;
		}
	}

	private setScript(html: string, id: string, data: unknown) {
		return html.replace(
			"{{ application-script }}",
			this.isConnexionToDBFailed(data)
				? ""
				: id.includes("admin")
				? `<script type="module" src="./js/admin/index.js"></script>
              <script src="https://cdn.jsdelivr.net/npm/apexcharts"></script>`
				: `<script type="module" src="./js/index.js"></script>`,
		);
	}

	private setTitle(html: string, title: string | undefined): string {
		return title ? html.replace("</title>", ` - ${title}</title>`) : html;
	}

	private setCss(html: string, css: string): string {
		return html.replace("{{ css }}", css);
	}

	private async setMainHtml({
		main,
		id,
		data,
		path,
		isUserConnected,
	}: ConfigMainHtmlType): Promise<string> {
		const strToReplace = "{{ content-insertion }}";

		main = main.replace("{{ id }}", id);

		// Error rendering.
		if (this.isConnexionToDBFailed(data)) {
			return main.replace(
				strToReplace,
				layout.SectionErrorHome.html(data as string),
			);
		}

		switch (id) {
			// Home rendering.
			case "data-home": {
				return main.replace(
					strToReplace,
					await layout.SectionsHome.html(
						data as Record<string, ProductSchemaWithIDType>,
					),
				);
			}

			// Product rendering.
			case "data-product": {
				return main.replace(
					strToReplace,
					layout.SectionsProduct.html({
						data: data as ProductFullDataType,
						isUserConnected,
					}),
				);
			}

			// Booking rendering.
			case "data-booking": {
				return main.replace(
					strToReplace,
					layout.SectionsBooking.html(data as BookingUserInfoType[]),
				);
			}

			// Profil form rendering.
			case "data-profil-form": {
				return main.replace(strToReplace, layout.SectionsProfilForm.html());
			}

			// Admin rendering.
			case "data-admin": {
				return main.replace(
					strToReplace,
					await layout.SectionAdmin.html(isUserConnected),
				);
			}

			// Contact rendering.
			case "data-contact": {
				return main.replace(strToReplace, layout.SectionContact.html());
			}

			// Not found rendering.
			case "data-not-found": {
				return main.replace(strToReplace, layout.NotFound.html);
			}

			default: {
				// Auth form rendering.
				if (path) {
					return main.replace(
						strToReplace,
						await layout.SectionAuthForm.html(path),
					);
				}

				return main.replace(strToReplace, "");
			}
		}
	}
}
