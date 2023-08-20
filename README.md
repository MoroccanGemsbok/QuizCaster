## Inspiration
As students, we know all too well the struggle of having to study for our classes by tackling a seemingly never-ending mountain of textbooks and other course notes. This studying method would frequently lead to information going through one ear and out the next, making it detrimental for unfortunate students. Textbooks and course notes are also unfriendly to those with are visually impaired, giving them a strong disadvantage in their education. 
At Hack the 6ix, our team recognized the need for a tool to help make knowledge more accessible and engaging, so we developed **QuizCaster**.

## What it Does
**QuizCaster** is an innovative and intelligent personal quiz assistant that transforms static sources like PDFs, links, and YouTube videos into dynamic learning experiences. Our platform utilizes the cutting-edge capabilities of GPT-4 to generate concise summaries of the provided content, condensing the essential information into a format that is easy to comprehend. Additionally, the powerful GPT-4 engine is used to craft relevant and thought-provoking quiz questions based on the content provided. This allows the user to not only review the source contents but truly learn it through the interactive quiz. Each source also has its task ID, allowing users to re-review information they have entered before, or share them with their friends.

However, what sets **QuizCaster** apart is its commitment to accessibility. We have incorporated voice commands and other audio features to cater to visually impaired users, enabling them to interact with the platform effortlessly. This integration ensures that learning is not limited by traditional barriers, making knowledge accessible to a wider audience.

## How we built it
We employed GPT-4's advanced natural language processing capabilities to generate both summaries and quiz questions. The integration of voice commands and audio input was achieved using Microsoft Azure's speech synthesis service and OpenAI's Whisper model.  The user interface was created using React and was designed to be intuitive and user-friendly, ensuring a seamless experience for all users.

For the technical implementation, we used a mix of programming languages, including Python for the backend and JavaScript for the front end. We used web scraping techniques to extract content from URLs, and PDF parsing libraries to extract data from PDFs. 

## Challenges we ran into
One challenge we encountered while developing **QuizCaster** was during the extraction and processing of information. It was difficult preparing the text to be well-readable without having to wait for a long while. 

To fix this issue, we developed our own **Naïve Bayes classifier** model that would scan a raw text and provide punctuation to clean it up. The model was trained on over 7.8 million sentences from Wikipedia, which allowed us to make the model very accurate.

## Accomplishments that we're proud of
As a team, we worked together and focused well to complete the development of **QuizCaster**. By dividing the project among us, we completed our goals efficiently and on time. We are immensely proud of what we've achieved with **QuizCaster** within the timeframe of Hack the 6ix.

## What we learned
We gained valuable insights into speech and audio synthesis, machine learning models, accessibility considerations, and the intricacies of training AI models like GPT-4. 

## What's next for QuizCaster
- Support for more information sources (photos, ebooks, etc.)
- More accessibility features
- Other options for the quiz, such as flashcards
