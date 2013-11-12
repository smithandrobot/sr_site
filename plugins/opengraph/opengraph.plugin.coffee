# Export Plugin
module.exports = (BasePlugin) ->
    extend = require('extend')

    # Define Plugin
    class OpenGraph extends BasePlugin
        name: 'opengraph'

        config:
            defaults:
                foo: '1234'

        writeBefore: (opts) ->
            docPad = @docPad
            config = @getConfig()
            pristine = config.defaults

            for model in opts.collection.models
                if model.get('outExtension') == 'html'
                    # console.log(model)
                    # shallow clone per model
                    headertags = extend({}, pristine, model.get('headtags'))
                    # remove scripts and styles
                    delete headertags.scripts if headertags.scripts
                    delete headertags.styles if headertags.styles
                    
                    # preserve all scripts/styles
                    scripts = @getTags(pristine, model, 'scripts')
                    styles = @getTags(pristine, model, 'styles')

                    # split tags between header tags and tags before </body>
                    headcontent = ''
                    footcontent = ''

                    for key,value of headertags
                        value = value?(model) ? value # function results or value

                        # check diffent header tag types
                        if (key.substr(0,3) == 'og:' )
                            headcontent += @createPropertyTag(key, value)
                        else if (key.substr(0,3) == 'fb:' )
                            headcontent += @createPropertyTag(key, value)
                        else
                            headcontent += @createMetaTag(key, value)

                    for style in styles
                        headcontent += @createLinkTag(style)
                    for script in scripts
                        footcontent += @createScriptTag(script)
                        

                    content = model.get('contentRendered')
                    if content
                        content = content.replace(/<\/title>/, '</title>' + headcontent)
                        content = content.replace(/<\/body>/, footcontent + '</body>')
                        model.set('contentRendered', content)

        getTags: (pristine, model, key) ->
            tags = []
            tags = tags.concat pristine[key]?(model) ? pristine[key] if pristine[key]
            if (model.get('headtags'))
                tags = tags.concat model.get('headtags')[key] if model.get('headtags')[key]

            tags

        createScriptTag: (value) ->
            "\n\t<script src=\"#{value}\"></script>"

        createLinkTag: (value) ->
            "\n\t<link rel=\"stylesheet\" href=\"#{value}\">"

        createPropertyTag: (key, value) ->
            "\n\t<meta property=\"#{key}\" content=\"#{value}\">"

        createMetaTag: (key, value) ->
            "\n\t<meta name=\"#{key}\" content=\"#{value}\">"
