# English Word Autocomplete with Typo Tolerance

This repository demonstrates an autocomplete system for English words, with the added feature of allowing up to 3 typos in the word.

# English Word Autocomplete with Typo Tolerance

This repository demonstrates an autocomplete system for English words, with the added feature of allowing up to 3 typos in the word. The system is built using Elasticsearch, utilizing advanced text analysis techniques such as edge n-grams, n-grams, and fuzzy matching to provide fast and accurate suggestions, even when the input contains typographical errors.

## Features

- **Autocomplete Functionality**: Provides word suggestions as the user types, based on prefix matching using edge n-grams.
- **Typo Tolerance**: Allows up to 3 typos in the input word, ensuring that users receive relevant suggestions even if they make mistakes while typing.
- **Multi-Field Analysis**: The system stores and indexes each word using multiple analyzers (edge n-gram, n-gram, and standard) to handle various search scenarios, such as prefix matching, substring matching, and exact matches.

## Setup

### Prerequisites

- **Elasticsearch**: Ensure you have Elasticsearch installed and running. The project is built using Elasticsearch 7.x, and Docker can be used to set up Elasticsearch locally.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/your-repo-name.git
   cd your-repo-name
   ```
2. Install dependencies: 
    ```bash
    npm i
    ```
3. Run setup.js file which contans index config
4. Run seed_words.js script to index each word from words.tar.gz file

### Examples of autocomplete search 

**Test word: "snakephobia"**

1. Standart: 
    - query: http://localhost:3000/autocomplete?query="snakephobia"
    - result: ["snakephobia","snakepipe","snakepiece","snakeproof","snake","snaker","snaked","snakey","snakes","snakery"]

2. 3 Typos: 
    - query: http://localhost:3000/autocomplete?query="snakephobbbbia"
    - result: ["snakephobia","snakepipe","snakepiece","snakeproof","snake","snaker","snaked","snakey","snakes","snakery"]

3. Autocomple basd of prefix:
    - query: http://localhost:3000/autocomplete?query="snakep"
    - result: ["snakepipe","snakepiece","snakeproof","snakephobia","snake","snaker","snaked","snakey","snakes","snakery"]


