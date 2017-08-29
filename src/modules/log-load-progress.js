const logLoadProgress = (loader, resource) => {
	console.log(`Progress ~${Math.round(loader.progress)}%, loading ${resource.url}.`)
}

export default logLoadProgress
