<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:template match="/page">
		<html>
			<head>
				<title><xsl:value-of select="@title"/></title>
				<link rel="stylesheet" type="text/css" href="./css/main.css" />
				<link rel="stylesheet" type="text/css" href="./css/menu_black.css" />
				<link rel="stylesheet" type="text/css" href="./css/codemirror.css" />
				<link rel="stylesheet" type="text/css" href="./css/nojw.css" />
				<xsl:apply-templates select="css" />
				<script type="text/javascript" src="./js/jquery-1.7.1.min.js"></script>
				<script type="text/javascript" src="./js/jquery.hoverIntent.js"></script>
				<script type="text/javascript" src="./js/jquery.metadata.js"></script>
				<script type="text/javascript" src="./js/mbMenu.js"></script>
				<script type="text/javascript" src="./js/codemirror.js"></script>
				<script type="text/javascript" src="./js/scheme.js"></script>
				<script type="text/javascript" src="./js/main.js"></script>
				<xsl:apply-templates select="js" />
				<script type="text/javascript">
						$(function(){
							setupMenu($('#menu'));
							<xsl:apply-templates select="load" />
							<xsl:for-each select="//editor">
								setupEditor(
									$('#<xsl:value-of select="@id" />'), 
									$('#cursor_<xsl:value-of select="@id" />'), 
									'<xsl:value-of select="@mode" />',
									onChange_<xsl:value-of select="@id" />
								);
							</xsl:for-each>
						});
				</script>
			</head>
			<body>
				<div id="wrapper">
					<div id="header">
						<h1 id="title"><a href="index.xml"><xsl:value-of select="@title"/></a></h1>  
					</div>
					<div id="menu">
						<table class="rootVoices">
							<tr>
								<td>
									<xsl:attribute name="class"><xsl:text disable-output-escaping="yes">rootVoice {menu: 'menu_scheem'}</xsl:text></xsl:attribute>
									Scheem
								</td>
							</tr>
						</table>
					</div>				
					<div id="menu_scheem" class="mbmenu boxMenu">
						<table>
							<tr>
								<td>
									<div class="menuImage"><img src="./images/scheme.png" alt="Scheem" /></div>
									<a href="./scheem_livetest.xml" target="_self">Live!</a>
									<a href="./scheem_webtest.xml" target="_self">Tests</a>
								</td>
							</tr>
						</table>
					</div>
					<div id="content">
						<xsl:apply-templates select="block" />
					</div>
					<div id="footer">
						Site built by Manuel Álvarez Álvarez
					</div>
				</div>
			</body>
		</html>
	</xsl:template>
	
	<xsl:template match="css">
		<link rel="stylesheet" type="text/css">
			<xsl:attribute name="href">
				<xsl:value-of select="@href"/>
			</xsl:attribute>
		</link>
	</xsl:template>
	
	<xsl:template match="js">
		<script type="text/javascript">
			<xsl:if test="@src != ''">
				<xsl:attribute name="src">
					<xsl:value-of select="@src"/>
				</xsl:attribute>
			</xsl:if>
			<xsl:value-of select="." />
		</script>
	</xsl:template>
	
	<xsl:template match="block">
		<h2><xsl:value-of select="@title"/></h2>  
		<xsl:apply-templates  />
	</xsl:template>
	
	<xsl:template match="p">
		<p><xsl:value-of select="."/></p>
	</xsl:template>
	
	<xsl:template match="html">
		<xsl:copy-of select="./*" />
	</xsl:template>
	
	<xsl:template match="load">
		<xsl:value-of select="." />
	</xsl:template>
	
	<xsl:template match="editor">
		<textarea>
			<xsl:attribute name="id"><xsl:value-of select="@id" /></xsl:attribute>
			<xsl:value-of select="." />
		</textarea>
		<div class="cursor">
			<xsl:attribute name="id">cursor_<xsl:value-of select="@id" /></xsl:attribute>
			1:1
		</div>
	</xsl:template>
	
</xsl:stylesheet> 