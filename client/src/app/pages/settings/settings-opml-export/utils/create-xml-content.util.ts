import { prettifyXml } from '@pages/settings/settings-opml-export/utils/prettify-xml.util';

export const createXmlContent = (opmlContent: string) => `<?xml version="1.0" encoding="UTF-8"?>\n${prettifyXml(opmlContent)}`;
