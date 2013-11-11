# Export Plugin
module.exports = (BasePlugin) ->
    # Define Plugin
    class OpenGraph extends BasePlugin
        name: 'opengraph'

        writeBefore: (opts) ->
            docPad = @docPad
            templateData = docpad.getTemplateData()
            siteUrl = templateData.site.url
            siteSummary = templateData.site.description

            for model in opts.collection.models
                if model.get('outExtension') == 'html'
                    url = @getTag('og:url', siteUrl+model.get('url')) 
                    title = @getTag('og:title', model.get('title'))
                    console.log(model)
                    if model.summary 
                        description = @getTag('og:description', model.summary) 
                    else 
                        description = @getTag('og:description', siteSummary)

                    content = model.get('contentRendered')
                    if content
                        content = content.replace(/<\/title>/, '</title>'+url+title+description)
                        model.set('contentRendered', content)

        populateCollections: (opts) ->
            docpad = @docpad
            config = @config
            templateData = docpad.getTemplateData()
            metaBlock = docpad.getBlock('meta')
            ogData = templateData.site.og
            img = if ogData?.image then ogData?.image else ''
            description = if ogData?.description then ogData.description else ''
            url = if ogData?.url then ogData.url else templateData.site.url
            metaBlock.add(@getTag("og:image", img))

        getTag: (ogName, data) ->
            return "\n    <meta property=\"#{ogName}\" content=\"#{data}\" />"
