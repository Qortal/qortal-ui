const styles = {
    breakpoints: {
        tablet: '',
        desktop: '',
        mobile: ''
    },
    theme: {
        colors: {
            // primary: '#64ffda', /* Sets the text color to the theme primary color. */
            primary: '#03a9f4', /* Sets the text color to the theme primary color. */
            primaryBg: '#e8eaf6', /* Sets the background color to the theme primary color. */
            onPrimary: '#fff', /* Sets the text color to the color configured for text on the primary color. */

            secondary: '#03a9f4', /* Sets the text color to the theme secondary color. */
            secondaryBg: '#fce4ec', /* Sets the background color to the theme secondary color. */
            onSecondary: '#fff', /* Sets the text color to the color configured for text on the secondary color. */

            surface: '#fff', /* Sets the background color to the surface background color. */
            onSurface: '#333', /* Sets the text color to the color configured for text on the surface color. */
            background: '#eee', /* Sets the background color to the theme background color. */

            warning: '#FFA000',
            error: '#F44336'
        },

        addressColors: [
            '#256480',
            '#002530',
            '#02564e',
            '#d32f2f',
            '#795548',
            '#004d40',
            '#006064',
            '#9c27b0',
            '#2196f3',
            '#d81b60'
        ]
    },
    // Will make theme be calculated from config.styles.themes[config.user.theme]... or make theme the base..so it becomes theme = {...config.styles.theme, ...config.styles.themes[config.user.theme]}
    themes: {
        light: {
            // ...
        },
        dark: {
            // ...
        }
        // And more... perhaps installable or user definable, like slack (...used to be? haven't been on it in ages)
    }
}

module.exports = styles
