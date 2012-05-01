<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output method="xml" doctype-system="http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd" 
		doctype-public="-//W3C//DTD XHTML 1.0 Strict//EN" indent="yes"/>
	<xsl:template match="/page">
		<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
			<head>
				<link rel="stylesheet" type="text/css" href="./css/main.css" />
				<title><xsl:value-of select="@title"/></title>
			</head>
			<body>
			</body>
		</html>
	</xsl:template>
</xsl:stylesheet> 