export const prettifyXml = function (sourceXml: string) {
  const sourceXmlDocument = new DOMParser().parseFromString(sourceXml, 'application/xml');
  const xsltDocument = new DOMParser().parseFromString(xmlIndentationStylesheet, 'application/xml');

  const xsltProcessor = new XSLTProcessor();
  xsltProcessor.importStylesheet(xsltDocument);
  const transformedDocument = xsltProcessor.transformToDocument(sourceXmlDocument);
  return new XMLSerializer().serializeToString(transformedDocument);
};

const xmlIndentationStylesheet = `
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
 <xsl:output omit-xml-declaration="yes" indent="yes"/>

    <xsl:template match="node()|@*">
      <xsl:copy>
        <xsl:apply-templates select="node()|@*"/>
      </xsl:copy>
    </xsl:template>
</xsl:stylesheet>
`;
