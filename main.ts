import { Plugin, MarkdownView } from "obsidian";

export default class DimInactiveParagraphsPlugin extends Plugin {
	private isDimmed = false;

	async onload() {
		this.addCommand({
			id: "toggle-dim-paragraphs",
			name: "Toggle Dim Inactive Paragraphs",
			callback: () => this.toggleDimParagraphs(),
		});

		const style = document.createElement("style");
		style.textContent = `
            .dim-inactive .cm-line:not(.cm-active):not(:hover) {
                opacity: 0.5;
                transition: opacity 0.2s ease-in-out;
            }
        `;
		document.head.appendChild(style);
	}

	private toggleDimParagraphs() {
		const view = this.app.workspace.getActiveViewOfType(MarkdownView);
		if (!view) return;

		const container = view.containerEl;
		this.isDimmed = !this.isDimmed;

		if (this.isDimmed) {
			container.addClass("dim-inactive");
		} else {
			container.removeClass("dim-inactive");
		}
	}

	onunload() {
		const views = this.app.workspace.getLeavesOfType("markdown");
		views.forEach((leaf) => {
			if (leaf.view instanceof MarkdownView) {
				leaf.view.containerEl.removeClass("dim-inactive");
			}
		});
	}
}
