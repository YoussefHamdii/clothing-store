import SimpleReactFooter from "simple-react-footer";

function Footer(){
    const description = "According to wikipedia, the cat (Felis catus) is a domestic species of small carnivorous mammal. It is the only domesticated species in the family Felidae and is often referred to as the domestic cat to distinguish it from the wild members of the family. A cat can either be a house cat, a farm cat or a feral cat; the latter ranges freely and avoids human contact.";
  const title = "𝕯𝕽𝕴𝕻";
  const columns = [
    {
        title: "Resources",
        resources: [
            {
                name: "About",
                link: "#"
            },
            {
                name: "Careers",
                link: "#"
            },
            {
                name: "Contact",
                link: "#"
            },
            {
                name: "Admin",
                link: "#"
            }
        ]
    },
    {
        title: "Legal",
        resources: [
            {
                name: "Privacy",
                link: "#"
            },
            {
                name: "Terms",
                link: "#"
            }
        ]
    },
    {
        title: "Visit",
        resources: [
            {
                name: "Locations",
                link: "#"
            },
            {
                name: "Culture",
                link: "#"
            }
        ]
    }
 ];
    return (
        <div>
            <SimpleReactFooter 
    description={description} 
    title={title}
    columns={columns}
    linkedin="fluffy_cat_on_linkedin"
    facebook="fluffy_cat_on_fb"
    twitter="fluffy_cat_on_twitter"
    instagram="fluffy_cat_live"
    youtube="UCFt6TSF464J8K82xeA?"
    pinterest="fluffy_cats_collections"
    copyright="Youssef Hamdi"
    iconColor="black"
    backgroundColor="#F54748"
    fontColor="white"
    copyrightColor="white"
 />;
        </div>
    );
}

export default Footer;