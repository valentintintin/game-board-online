<!doctype html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
<!--    <meta http-equiv="refresh" content="2;URL=">-->
    <title>Collections</title>

    <style>
        ul {
            display: flex;
            flex-wrap: wrap;
        }

        .nom-initial {
            display: flex;
            flex-wrap: wrap;
        }

        .image {
            max-width: 300px;
            overflow: scroll;
        }

        img {
            max-width: 150px;
        }
    </style>

    <script>
        document.addEventListener('DOMContentLoaded', function() {
            const images = document.querySelectorAll('.image');
            for (const image of images) {
                image.addEventListener('click', function (event) {
                    if (image.style.backgroundColor === 'red') {
                        image.style.backgroundColor = '';
                    } else {
                        image.style.backgroundColor = 'red';
                    }
                });
            }
        });
    </script>
</head>
<body>
<h1>Collections</h1>
<?php
$collections = json_decode(file_get_contents('database.json'))->collections;
foreach ($collections as $collection): ?>
    <div class="collection">
        <div class="nom-collection">
            <h2><?= $collection->name ?></h2>
            <img src="/front/src<?= $collection->imageUrl[0] ?>" />
        </div>

        <div class="initials">
            <h3>Initial</h3>
            <?php foreach ($collection->initial as $initial): ?>
                <ul>
                    <li>
                        <div class="initial">
                            <div class="nom-initial">
                                <?= $initial->name ?>
                                <?php if ($initial->allImageOptions):
                                    dump($initial->allImageOptions);
                                    if ($initial->allImageOptions->imageBackUrl) {
                                        echo '<img src="/front/src' . $initial->allImageOptions->imageBackUrl . '" title="Back" />';
                                    }
                                endif; ?>
                            </div>
                            <div class="images">
                                <h4>Images</h4>
                                <ul>
                                    <?php foreach ($initial->images as $image): ?>
                                        <li>
                                            <?php showImage($image) ?>
                                        </li>
                                    <?php endforeach; ?>
                                </ul>
                            </div>
                        </div>
                    </li>
                </ul>
            <?php endforeach; ?>
        </div>

        <div class="images">
            <h3>Images</h3>
            <ul>
                <?php foreach ($collection->images as $image): ?>
                    <li>
                        <?php showImage($image) ?>
                    </li>
                <?php endforeach; ?>
            </ul>
        </div>
    </div>
<?php endforeach; ?>

</body>
</html>


<?php
function showImage(stdClass $image): void {
    echo '<div class="image">' . $image->name;
    echo '<img src="/front/src' . $image->imageUrl . '" width="' . $image->width . '" height="' . $image->height . '" />';
    if ($image->imageBackUrl) {
	    echo '<img src="/front/src' . $image->imageBackUrl . '" width=" title="Back" />';
    }
    dump($image);
    echo '</div>';
}

function dump($what): void {
	echo '<pre>' . var_export($what, true) . '</pre>';
}
