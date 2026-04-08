import siteConfig from "../config/siteConfig";
import { componentMap } from "../components/componentMap";

export default function HomePage() {
    const page = siteConfig.pages.home;

    return (
        <div className="page-wrapper">
            {page.sections.map((section, index) => {
                if (!section.enabled) return null;

                const Component = componentMap[section.type];

                if (!Component) {
                    console.warn(`Missing component: ${section.type}`);
                    return null;
                }

                return (
                    <div key={index} className="section-wrapper">
                        <Component {...section.props} />
                    </div>
                );
            })}
        </div>
    );
}