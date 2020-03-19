import React from 'react'

import IconButton from '@material-ui/core/IconButton'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'

import ZushiWorkshop from './images/Zushi Workshop.jpg'

import classes from './App.scss'

export default function StoryPage ({ onBackClick }) {
  const handleBackClick = () => {
    onBackClick()
  }
  return (
    <div>
      <IconButton style={{ top: '115px', left: '120px', position: 'absolute' }}>
        <ArrowBackIcon onClick={handleBackClick} />
      </IconButton>
      <div className={classes.StoriesSingleText}>
        <h1>Example Story</h1>
        <br />
        <img
          style={{ align: 'center', textAlign: 'center' }}
          width={500}
          src={ZushiWorkshop}
        />
        <h2>OMNI Workshop at Zushi Highschool</h2>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Duis at
          consectetur lorem donec massa sapien faucibus et molestie. Elementum
          sagittis vitae et leo duis ut diam. Non odio euismod lacinia at quis
          risus sed vulputate odio. Fames ac turpis egestas integer eget aliquet
          nibh praesent. Interdum posuere lorem ipsum dolor sit amet consectetur
          adipiscing. Volutpat lacus laoreet non curabitur gravida arcu ac
          tortor. A diam maecenas sed enim ut sem viverra aliquet eget. Elit
          duis tristique sollicitudin nibh sit. Eu mi bibendum neque egestas.
          Dolor magna eget est lorem ipsum. Nunc eget lorem dolor sed viverra.
          Ut eu sem integer vitae justo eget magna. Tellus pellentesque eu
          tincidunt tortor aliquam nulla facilisi cras fermentum.
        </p>
        <p>
          Mauris nunc congue nisi vitae suscipit tellus mauris a diam. Lorem
          dolor sed viverra ipsum nunc. Commodo quis imperdiet massa tincidunt
          nunc pulvinar sapien. Accumsan lacus vel facilisis volutpat. Diam in
          arcu cursus euismod quis. Sapien pellentesque habitant morbi tristique
          senectus. Mi tempus imperdiet nulla malesuada. Mattis molestie a
          iaculis at erat pellentesque. Amet tellus cras adipiscing enim eu.
          Sapien et ligula ullamcorper malesuada. Ut sem viverra aliquet eget
          sit amet tellus. Aliquam sem et tortor consequat id porta. Risus
          nullam eget felis eget. Pellentesque habitant morbi tristique
          senectus. Velit ut tortor pretium viverra suspendisse potenti.
          Praesent semper feugiat nibh sed. Curabitur vitae nunc sed velit
          dignissim sodales ut eu.
        </p>
        <p>
          Pharetra convallis posuere morbi leo urna molestie at elementum. Donec
          ac odio tempor orci dapibus ultrices in. Dictumst quisque sagittis
          purus sit amet. Bibendum enim facilisis gravida neque convallis a.
          Ultricies integer quis auctor elit sed vulputate. Sagittis id
          consectetur purus ut faucibus pulvinar elementum integer enim.
          Ullamcorper sit amet risus nullam eget felis. Elementum sagittis vitae
          et leo duis ut diam. Ut tellus elementum sagittis vitae et leo duis ut
          diam. Amet massa vitae tortor condimentum lacinia. Ornare massa eget
          egestas purus.
        </p>
        <p>
          Risus in hendrerit gravida rutrum quisque non tellus orci ac. Metus
          vulputate eu scelerisque felis imperdiet proin. A condimentum vitae
          sapien pellentesque. Sit amet consectetur adipiscing elit duis. Mi sit
          amet mauris commodo quis imperdiet. Sit amet massa vitae tortor
          condimentum. Pharetra diam sit amet nisl suscipit adipiscing bibendum
          est. Lectus mauris ultrices eros in cursus. Dolor sit amet consectetur
          adipiscing elit duis tristique sollicitudin nibh. Porta non pulvinar
          neque laoreet suspendisse interdum consectetur libero. Sapien faucibus
          et molestie ac. Dui nunc mattis enim ut tellus elementum sagittis
          vitae et. Amet venenatis urna cursus eget nunc scelerisque viverra
          mauris. Ut tortor pretium viverra suspendisse potenti nullam ac. Risus
          feugiat in ante metus dictum at tempor commodo ullamcorper. Mauris
          augue neque gravida in fermentum et sollicitudin ac.
        </p>
        <p>
          Iaculis nunc sed augue lacus viverra vitae. Dolor purus non enim
          praesent elementum facilisis. Nisi vitae suscipit tellus mauris a diam
          maecenas sed. Posuere urna nec tincidunt praesent semper feugiat.
          Vivamus at augue eget arcu dictum varius. Accumsan lacus vel facilisis
          volutpat est velit. Sit amet purus gravida quis blandit turpis cursus
          in hac. Risus at ultrices mi tempus imperdiet. Massa eget egestas
          purus viverra accumsan in nisl. In ante metus dictum at tempor.
          Volutpat est velit egestas dui id ornare arcu. Ridiculus mus mauris
          vitae ultricies leo integer malesuada nunc. Tincidunt ornare massa
          eget egestas purus viverra accumsan in. Nisi est sit amet facilisis
          magna etiam tempor orci. Rhoncus est pellentesque elit ullamcorper
          dignissim cras. In mollis nunc sed id semper. Odio pellentesque diam
          volutpat commodo sed egestas egestas fringilla phasellus. Ornare quam
          viverra orci sagittis eu volutpat odio. Ultrices gravida dictum fusce
          ut placerat.
        </p>
      </div>
    </div>
  )
}
