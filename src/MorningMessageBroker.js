const fs = require('fs').promises;
const routes = require('./AppRoutes.js');
const express = require('express');

function main() {
	routes.initiateServer();
}

main();
