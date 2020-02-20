import React, { Component } from 'react'

import { Redirect, Link } from 'react-router-dom'

import { connect } from 'react-redux'
import { bindActionCreators } from "redux"
import { setToast } from "../../../redux/toastActions"
import { success, error } from "../../../config/toasts"

import { Container, Grid, Button, Table,
    TableRow, TableHead, TableBody, TableCell,
    TableFooter, TablePagination, Dialog, DialogActions, DialogContent,
    DialogContentText, DialogTitle, Paper, Icon,
    Box } from '@material-ui/core'
import SearchBar from 'material-ui-search-bar'

import CustomButton from '../../../components/Button.jsx'
import CustomIconButton from '../../../components/IconButton.jsx'
import Header from '../../../components/Header.jsx'
import Searching from '../../../assets/loading.gif'

import axios from 'axios'
import { backendUrl, defineErrorMsg } from '../../../config/backend'
import { OPTIONS_LIMIT, DEFAULT_LIMIT, LIMIT_LABEL, DISPLAYED_ROWS } from '../../../config/dataProperties'

class Categories extends Component {
    
    
    state = { 
        categories: [],
        loading: false,
        query: '',
        page: 1,
        count: 0,
        limit: DEFAULT_LIMIT,
        error: false,
        dialog: false,
        loadingOp: false,
        categorySelected: null
    }

    toogleLoading(){
        this.setState({loading: !this.state.loading})
    }

    async changeQueryValue(query){
        /* Realiza a busca de categorias por palavra chave */
        
        await this.setState({
            query,
            page: 1
        })

        this.searchCategories()
    }

    async searchCategories(){
        /* Responsável por realizar a busca de categorias */

        const url = `${backendUrl}/categories?page=${this.state.page}&query=${this.state.query}&limit=${this.state.limit}`
        if(this.state.categories.length > 0) this.setState({categories: []})
        
        await this.toogleLoading()
        await axios(url).then(res => {
            this.setState({
                categories: res.data.categories,
                count: res.data.count,
                limit: res.data.limit,
                error: false,
                // loading: false,
            })
        }).catch(error => {
            this.setState({error: true})
        })

        this.toogleLoading()
    }

    async remove(){
        /* Responsável por realizar a exclusão de categorias */

        this.setState({loadingOp: true})
        const id = this.state.categorySelected._id
        const url = `${backendUrl}/categories/${id}`

        await axios.delete(url).then(() => {
            this.props.setToast(success('Operação realizada com sucesso'))
        }).catch( async err => {
            const msg = await defineErrorMsg(err)
            this.props.setToast(error(msg))
        })
        this.setState({loadingOp: false, dialog: false})
        this.searchCategories()
    }

    goTo = path => event => {
        this.setState({
            redirectTo: `/${path}`
        })
    }

    selectCategory = theme => event => {
        /*  Usado para selecionar a categoria desejada para remover e também
            habilitando o modal de confirmação de exclusão 
        */

        this.setState({
            dialog: true,
            categorySelected: theme 
        })
    }

    toogleDialog = (option) => {
        /* Realiza o toogle no dialog de exclusão */

        this.setState({
            dialog: option ? true : false
        })
    }

    changePage = async (event, page) => {
        /* Realiza a alternação de páginas da tabela de registros */

        await this.setState({
            page: ++page
        })
        
        this.searchCategories()
    }

    defineLimit = async (event) => {
        /* Define o limite de registros por páginas na tabela de registros */

        const limit = event.target.value

        await this.setState({
            limit: parseInt(limit)
        })

        this.searchCategories()
    }

    componentDidMount(){
        this.searchCategories()
    }

    render() { 
        return ( 
            <Container id="component">
                {this.state.redirectTo && 
                    <Redirect to={this.state.redirectTo} />
                }
                <Header title="Categorias" description="Categorias para artigos" icon="category"></Header>
                <Container className="hudBar">
                    <Grid item className="hudBarChild">
                        { this.props.user.tagAdmin && 
                            <Box mr={1} className="linkButton">
                                <Link to="/category" className="linkRouter linkButton">
                                    <CustomButton color="default" text="Nova Categoria"
                                        icon="add_circle_outline" />
                                </Link>
                            </Box>
                        }
                        { this.props.user.tagAdmin && <Box mr={1} className="linkButton">
                            <Link to="/management" className="linkRouter linkButton">
                                <CustomButton color="gray" text="Configurações"
                                    icon="settings" />
                            </Link>
                        </Box>}
                    </Grid>
                    <Grid item className="hudBarChild">
                        <SearchBar id="search_field" className="searchTextField"
                            placeholder="Pesquisar" value={this.state.query}
                            onChange={(query) => this.changeQueryValue(query)} 
                            onCancelSearch={() => this.changeQueryValue('')} />
                    </Grid>
                </Container>
                {this.state.loading && 
                    <Container className="center spinnerContainer">
                        <img src={Searching} alt="Procurando categorias..."/>
                        <h4>
                            Carregando, por favor aguarde...
                        </h4>
                    </Container>
                }
                {!this.state.loading && this.state.categories.length === 0 &&
                    <Container className="center">
                        <p className="defaultFontColor">
                            Ops, Nenhum resultado encontrado
                        </p>
                    </Container>
                }
                {this.state.categories.length > 0 && !this.state.loading && 
                    <Paper>
                        <Container className="wrapper">
                            <Table className="defaultTable">
                                {/* Header da tabela */}
                                <TableHead>
                                    <TableRow>
                                        <TableCell>
                                            <span className="centerVertical">
                                                <Icon fontSize="small" className="marginRight">
                                                    category
                                                </Icon>
                                                Categoria
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <span className="centerVertical">
                                                <Icon fontSize="small" className="marginRight">
                                                    bookmark_border
                                                </Icon>
                                                Alias
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <span className="centerVertical">
                                                <Icon fontSize="small" className="marginRight">
                                                    bookmark
                                                </Icon>
                                                Tema
                                            </span>
                                        </TableCell>
                                        { this.props.user.tagAdmin && 
                                            <TableCell>
                                                <span className="centerVertical">
                                                    <Icon fontSize="small" className="marginRight">
                                                        build
                                                    </Icon>
                                                    Ações
                                                </span>
                                            </TableCell>
                                        }
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                {/* Geração dos registros na tabela  */}
                                {this.state.categories.map(category => (
                                    <TableRow key={category._id}>
                                        <TableCell scope="name">
                                            {category.name}
                                        </TableCell>
                                        <TableCell scope="alias">
                                            {category.alias}
                                        </TableCell>
                                        <TableCell scope="theme">
                                            {category.theme.name || 'Sem categoria'}
                                        </TableCell>
                                        { this.props.user.tagAdmin && 
                                            <TableCell scope="_id">
                                                <CustomIconButton icon="edit" color="default"
                                                    aria-label="Editar" tooltip="Editar"
                                                    onClick={this.goTo(`category/${category._id}`)}
                                                />
                                                <CustomIconButton icon="delete_forever" color="danger"
                                                    aria-label="Delete" tooltip="Remover"
                                                    onClick={this.selectCategory(category)}
                                                />
                                            </TableCell>
                                        }
                                    </TableRow>
                                ))}
                                </TableBody>
                                {/* Footer da tabela */}
                                <TableFooter>
                                    <TableRow>
                                        <TablePagination 
                                            rowsPerPageOptions={OPTIONS_LIMIT}
                                            colSpan={4}
                                            count={this.state.count}
                                            rowsPerPage={this.state.limit}
                                            labelRowsPerPage={LIMIT_LABEL}
                                            labelDisplayedRows={DISPLAYED_ROWS}
                                            page={this.state.page - 1}
                                            SelectProps={{
                                                inputProps: {'aria-label': 'Limite'},
                                            }}
                                            onChangePage={this.changePage}
                                            onChangeRowsPerPage={this.defineLimit}
                                        />
                                    </TableRow>
                                </TableFooter>
                            </Table>
                            {/* Remover dialog */}
                            <Dialog
                                open={this.state.dialog}
                                onClose={() => this.toogleDialog(false)}
                                aria-labelledby="title"
                                aria-describedby="are_you_sure"
                            >
                                <DialogTitle id="title">{this.state.loadingOp ? "Removendo" : "Excluir usuário"}</DialogTitle>
                                <DialogContent>
                                    <Container>
                                        {!this.state.loadingOp &&
                                            <DialogContentText id="are_you_sure">
                                                Tem certeza que deseja remover este tema?
                                            </DialogContentText>
                                        }
                                        {this.state.loadingOp && 
                                            <DialogContentText id="description">
                                                Removendo tema, por favor aguarde...
                                            </DialogContentText>
                                        }
                                    </Container>
                                </DialogContent>
                                <DialogActions>
                                    { !this.state.loadingOp && 
                                        <Button color="secondary" 
                                            onClick={() => this.toogleDialog(false)}
                                        >
                                            Fechar
                                        </Button>
                                    }
                                    {!this.state.loadingOp && 
                                        <Button color="secondary" 
                                            onClick={() => this.remove(this.state.categorySelected)}
                                        >
                                            Sim, pode excluir
                                        </Button>
                                    }
                                </DialogActions>
                            </Dialog>
                        </Container>
                    </Paper>
                }
            </Container>
        )
    }
}


const mapStateToProps = state => ({user: state.user, toast: state.config})
const mapDispatchToProps = dispatch => bindActionCreators({setToast}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Categories)