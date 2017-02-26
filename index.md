<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>
<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.6.2/angular.min.js"></script>
<script src="http://praytimes.org/code/v2/js/PrayTimes.js"></script>
<script src="time-calc.js"></script>
<script>
 
    // Your code goes here.
 
</script>
**Enter Time:** (h:m:s)
<div ng-app="timeCalc" ng-controller="CtrlTimeCalc as timeCalc">
Dawn: <input type="text" ng-model="timeCalc.timeDawn" ng-change="timeCalc.change()"/><br/>
Sunrise: <input type="text" ng-model="timeCalc.timeSunrise" ng-change="timeCalc.change()"/><br/>
Sunset: <input type="text" ng-model="timeCalc.timeSunset" ng-change="timeCalc.change()"/>

<p><strong>Length of day:</strong> [{timeCalc.dayLength}]</p>
</div>

## Welcome to GitHub Pages

You can use the [editor on GitHub](https://github.com/zishanj/prayer-time-calc/edit/master/index.md) to maintain and preview the content for your website in Markdown files.

Whenever you commit to this repository, GitHub Pages will run [Jekyll](https://jekyllrb.com/) to rebuild the pages in your site, from the content in your Markdown files.

### Markdown

Markdown is a lightweight and easy-to-use syntax for styling your writing. It includes conventions for

```markdown
Syntax highlighted code block

# Header 1
## Header 2
### Header 3

- Bulleted
- List

1. Numbered
2. List

**Bold** and _Italic_ and `Code` text

[Link](url) and ![Image](src)
```

For more details see [GitHub Flavored Markdown](https://guides.github.com/features/mastering-markdown/).

### Jekyll Themes

Your Pages site will use the layout and styles from the Jekyll theme you have selected in your [repository settings](https://github.com/zishanj/prayer-time-calc/settings). The name of this theme is saved in the Jekyll `_config.yml` configuration file.

### Support or Contact

Having trouble with Pages? Check out our [documentation](https://help.github.com/categories/github-pages-basics/) or [contact support](https://github.com/contact) and we’ll help you sort it out.
