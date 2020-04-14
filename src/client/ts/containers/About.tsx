import * as React from 'react'
import '@client/scss/pages/about.scss'
import Header from '@client/components/Header/Header'
import Footer from '@client/components/Footer/Footer'

function About(): JSX.Element {
  return (
    <div className="page about">
      <Header />
      <div className="content-one">
        <section className="about-body container">
          <h1>About</h1>
          <p>
            <b>Imgflip is a simple and fast website for creating and sharing images. We specialize in memes and GIFs.</b>
          </p>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Harum libero omnis vero corporis modi et, dicta, nulla quidem
            saepe similique ab porro perferendis voluptatibus! Reiciendis ullam modi id adipisci eaque!
          </p>
          <p>
            <b>Imgflip is a simple and fast website for creating and sharing images. We specialize in memes and GIFs.</b>
          </p>
          <p>
            You can contact me at : <a href="mailto:email@email.fr">email@email.fr</a>
          </p>
          <p>
            Meme Studio is an open source project :{' '}
            <a href="https://github.com/viclafouch/meme-studio" target="_blank">
              https://github.com/viclafouch/meme-studio
            </a>
          </p>
          <iframe
            src="https://ghbtns.com/github-btn.html?user=viclafouch&repo=meme-studio&type=star&count=true"
            frameBorder="0"
            scrolling="0"
            width="90px"
            height="20px"
          ></iframe>
          <iframe
            src="https://ghbtns.com/github-btn.html?user=viclafouch&type=follow&count=true"
            frameBorder="0"
            scrolling="0"
            width="170px"
            height="20px"
          ></iframe>
        </section>
      </div>
      <Footer />
    </div>
  )
}

export default About
